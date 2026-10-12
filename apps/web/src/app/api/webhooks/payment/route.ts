import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/services";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderId = body.order_id as string | undefined;
    const statusCode = body.status_code as string | undefined;
    const grossAmount = body.gross_amount as string | undefined;
    const signatureKey = body.signature_key as string | undefined;
    const transactionStatus = body.transaction_status as string | undefined;
    const paymentType = body.payment_type as string | undefined;
    const transactionId = body.transaction_id as string | undefined;

    if (!orderId) {
      return NextResponse.json(
        { error: "order_id tidak ditemukan pada payload webhook" },
        { status: 400 }
      );
    }

    // Verifikasi Signature Hash (SHA-512)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "dummy_server_key";
    if (statusCode && grossAmount && signatureKey && process.env.NODE_ENV === "production") {
      const expectedSignature = createHash("sha512")
        .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
        .digest("hex");

      if (expectedSignature !== signatureKey) {
        return NextResponse.json(
          { error: "Invalid Midtrans signature key hash" },
          { status: 403 }
        );
      }
    }

    // Temukan Order di Basis Data
    const order = await db.order.findUnique({
      where: {
        orderNumber: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: `Order dengan nomor "${orderId}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    // Periksa status pembayaran Midtrans
    const isSuccess =
      transactionStatus === "settlement" ||
      transactionStatus === "capture" ||
      transactionStatus === "success";

    if (isSuccess) {
      // 1. Perbarui status order menjadi PAID
      await db.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "PAID",
        },
      });

      // 2. Catat / upsert PaymentTransaction
      await db.paymentTransaction.upsert({
        where: {
          orderId: order.id,
        },
        create: {
          orderId: order.id,
          gateway: "MIDTRANS",
          transactionId: transactionId ?? null,
          paymentType: paymentType ?? "qris",
          paymentStatus: "PAID",
          rawResponse: body,
          paidAt: new Date(),
        },
        update: {
          transactionId: transactionId ?? undefined,
          paymentType: paymentType ?? undefined,
          paymentStatus: "PAID",
          rawResponse: body,
          paidAt: new Date(),
        },
      });

      // 3. Perbarui tingkat paket User menjadi PREMIUM
      await db.user.update({
        where: {
          id: order.userId,
        },
        data: {
          packageTier: "PREMIUM",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notifikasi webhook Midtrans berhasil diproses.",
      orderNumber: orderId,
      isPaid: isSuccess,
    });
  } catch (error) {
    console.error("Gagal memproses webhook pembayaran:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server webhook." },
      { status: 500 }
    );
  }
}
