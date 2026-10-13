"use client";

import { useRef, useState } from "react";
import {
  Check,
  Clock,
  Disc3,
  Music,
  Pause,
  Play,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@senara/ui/components/dialog";
import { Input } from "@senara/ui/components/input";
import { Label } from "@senara/ui/components/label";
import { Slider } from "@senara/ui/components/slider";
import { Switch } from "@senara/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@senara/ui/components/tabs";
import { cn } from "@senara/ui/lib/utils";

export interface MusicConfigSelection {
  musicUrl: string | null;
  musicTitle: string;
  isMusicAutoplay: boolean;
  musicStartAt: number;
  musicSourceType: "library" | "upload" | "youtube";
}

export interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  url: string;
}

export const BUILTIN_MUSIC_LIBRARY: LibraryTrack[] = [
  {
    id: "romantic-piano",
    title: "Eternal Vows (Romantic Piano & Strings)",
    artist: "Senara Ensemble",
    category: "Romantis",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113540.mp3",
  },
  {
    id: "gending-jawa",
    title: "Larasati Keraton (Gamelan Jawa Halus)",
    artist: "Karawitan Nusantara",
    category: "Adat Jawa",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=peaceful-garden-110241.mp3",
  },
  {
    id: "acoustic-warm",
    title: "Morning Sunbeam (Acoustic Guitar)",
    artist: "Senara Acoustic",
    category: "Hangat & Santai",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-motivation-11290.mp3",
  },
  {
    id: "islamic-harp",
    title: "Cahaya Doa (Instrumental Syahdu)",
    artist: "Harmoni Medina",
    category: "Islami / Syukuran",
    url: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=inspiring-cinematic-ambient-116199.mp3",
  },
  {
    id: "happy-party",
    title: "Sparkling Confetti (Upbeat Celebration)",
    artist: "Party Studio",
    category: "Ulang Tahun",
    url: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_67bcf72968.mp3?filename=happy-day-113985.mp3",
  },
];

export function extractYouTubeId(inputUrl: string): string | null {
  const trimmed = inputUrl.trim();
  if (!trimmed) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function formatSecondsToMmSs(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

interface MusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMusicUrl?: string | null;
  currentMusicTitle?: string | null;
  currentAutoplay?: boolean;
  currentStartAt?: number;
  onSaveMusic: (selection: MusicConfigSelection) => void;
}

export function MusicModal({
  open,
  onOpenChange,
  currentMusicUrl,
  currentMusicTitle,
  currentAutoplay = true,
  currentStartAt = 0,
  onSaveMusic,
}: MusicModalProps) {
  const initialIsYouTube = Boolean(
    currentMusicUrl && extractYouTubeId(currentMusicUrl)
  );
  const initialIsLibrary = BUILTIN_MUSIC_LIBRARY.some(
    (t) => t.url === currentMusicUrl
  );

  const [activeTab, setActiveTab] = useState<"library" | "upload" | "youtube">(
    initialIsYouTube ? "youtube" : initialIsLibrary || !currentMusicUrl ? "library" : "upload"
  );
  const [selectedUrl, setSelectedUrl] = useState<string>(
    currentMusicUrl || BUILTIN_MUSIC_LIBRARY[0]!.url
  );
  const [selectedTitle, setSelectedTitle] = useState<string>(
    currentMusicTitle || BUILTIN_MUSIC_LIBRARY[0]!.title
  );
  const [youtubeInput, setYoutubeInput] = useState<string>(
    initialIsYouTube ? (currentMusicUrl ?? "") : ""
  );
  const [startAt, setStartAt] = useState<number>(currentStartAt || 0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(currentAutoplay);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(
    null
  );

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPlayingPreviewUrl(null);
  };

  const handleTogglePreview = (trackUrl: string) => {
    if (playingPreviewUrl === trackUrl) {
      stopPreview();
      return;
    }
    stopPreview();
    const audio = new Audio(trackUrl);
    audio.currentTime = startAt;
    audio
      .play()
      .then(() => {
        previewAudioRef.current = audio;
        setPlayingPreviewUrl(trackUrl);
      })
      .catch(() => {
        toast.error("Tidak dapat memutar pratinjau audio ini.");
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Ukuran file audio maksimal 8 MB.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setSelectedUrl(objectUrl);
    setSelectedTitle(file.name.replace(/\.(mp3|m4a|wav)$/i, ""));
    toast.success(`Berhasil memuat lagu "${file.name}"`);
  };

  const handleSave = () => {
    stopPreview();

    if (activeTab === "youtube") {
      const ytId = extractYouTubeId(youtubeInput);
      if (!ytId) {
        toast.error("Masukkan link video YouTube yang valid.");
        return;
      }
      onSaveMusic({
        musicUrl: `https://www.youtube.com/watch?v=${ytId}`,
        musicTitle: selectedTitle || `YouTube Audio (${ytId})`,
        isMusicAutoplay: isAutoplay,
        musicStartAt: startAt,
        musicSourceType: "youtube",
      });
      onOpenChange(false);
      return;
    }

    onSaveMusic({
      musicUrl: selectedUrl || null,
      musicTitle: selectedTitle || "Musik Latar Undangan",
      isMusicAutoplay: isAutoplay,
      musicStartAt: startAt,
      musicSourceType: activeTab,
    });
    onOpenChange(false);
  };

  const ytPreviewId = extractYouTubeId(youtubeInput);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) stopPreview();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              <Music className="mr-1 size-3" />
              Audio & Musik Latar
            </Badge>
          </div>
          <DialogTitle>Pengelola Musik Undangan</DialogTitle>
          <DialogDescription>
            Pilih musik dari pustaka kurasi, unggah MP3/M4A milikmu sendiri, atau gunakan tautan YouTube beserta detik mulai lagu.
          </DialogDescription>
        </DialogHeader>

        {/* Sakelar Aktifkan Musik */}
        <div className="flex items-center justify-between rounded-xl border p-3">
          <div>
            <p className="text-xs font-semibold">Putar Otomatis Saat Sampul Dibuka</p>
            <p className="text-muted-foreground text-[11px]">
              Musik otomatis menyala ketika tamu menekan tombol Buka Undangan
            </p>
          </div>
          <Switch checked={isAutoplay} onCheckedChange={setIsAutoplay} />
        </div>

        {/* 3 Tab Sumber Musik menggunakan Shadcn Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) =>
            setActiveTab(val as "library" | "upload" | "youtube")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library" className="gap-1.5">
              <Disc3 className="size-3.5" />
              <span>Pilih Lagu</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-1.5">
              <Upload className="size-3.5" />
              <span>Lagu Sendiri</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="gap-1.5">
              <Video className="size-3.5 text-rose-500" />
              <span>Dari YouTube</span>
            </TabsTrigger>
          </TabsList>

          {/* Isi Tab 1: Pustaka Lagu */}
          <TabsContent value="library" className="mt-3 space-y-2">
            {BUILTIN_MUSIC_LIBRARY.map((track) => {
              const isSelected = selectedUrl === track.url;
              const isPlayingThis = playingPreviewUrl === track.url;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setSelectedUrl(track.url);
                    setSelectedTitle(track.title);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 ring-primary/25 ring-1"
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant={isPlayingThis ? "default" : "outline"}
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePreview(track.url);
                      }}
                    >
                      {isPlayingThis ? (
                        <Pause className="size-3.5" />
                      ) : (
                        <Play className="size-3.5" />
                      )}
                    </Button>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">
                        {track.title}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {track.artist} •{" "}
                        <span className="text-primary font-medium">
                          {track.category}
                        </span>
                      </p>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check className="text-primary size-4 shrink-0" />
                  ) : null}
                </div>
              );
            })}
          </TabsContent>

          {/* Isi Tab 2: Lagu Kamu Sendiri (MP3 / M4A) */}
          <TabsContent
            value="upload"
            className="mt-3 space-y-3 rounded-xl border p-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="music-file">Unggah File Audio (.mp3 / .m4a)</Label>
              <Input
                id="music-file"
                type="file"
                accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/*"
                onChange={handleFileUpload}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="music-custom-url">
                Atau Tempel URL Langsung File Audio (MP3/M4A)
              </Label>
              <Input
                id="music-custom-url"
                type="url"
                placeholder="https://.../lagu-pernikahan.mp3"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="music-custom-title">Judul Lagu yang Ditampilkan</Label>
              <Input
                id="music-custom-title"
                placeholder="Contoh: Beautiful in White - Shane Filan"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Isi Tab 3: Dari YouTube */}
          <TabsContent
            value="youtube"
            className="mt-3 space-y-3 rounded-xl border p-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="yt-url">Link Video YouTube</Label>
              <Input
                id="yt-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yt-title">Judul Lagu</Label>
              <Input
                id="yt-title"
                placeholder="Contoh: Payung Teduh - Akad"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
              />
            </div>

            {ytPreviewId ? (
              <div className="overflow-hidden rounded-lg border bg-black">
                <iframe
                  title="YouTube Music Preview"
                  src={`https://www.youtube.com/embed/${ytPreviewId}?start=${startAt}`}
                  className="aspect-video w-full"
                  allow="autoplay; encrypted-media"
                />
              </div>
            ) : null}
          </TabsContent>
        </Tabs>

        {/* Slider "Mulai dari" (startAt) menggunakan Shadcn Slider */}
        <div className="bg-muted/30 space-y-3 rounded-xl border p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold">
              <Clock className="text-primary size-3.5" />
              Mulai lagu dari detik ke-
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {formatSecondsToMmSs(startAt)} ({startAt} dtk)
            </Badge>
          </div>
          <Slider
            min={0}
            max={180}
            step={1}
            value={[startAt]}
            onValueChange={(val) => {
              const nextVal = Array.isArray(val) ? val[0] : val;
              if (typeof nextVal === "number") {
                setStartAt(nextVal);
              }
            }}
          />
          <p className="text-muted-foreground text-[11px]">
            Geser untuk langsung memulai lagu pada bagian reff saat tamu menekan tombol Buka Undangan.
          </p>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              stopPreview();
              onOpenChange(false);
            }}
          >
            Batal
          </Button>
          <Button type="button" onClick={handleSave}>
            Simpan Pengaturan Musik
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
