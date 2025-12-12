"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Download, Trash2, QrCodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data - will be replaced with RTK Query
const mockRooms = [
  { id: "1", name: "Sample Room", location: "Sahil" },
  { id: "2", name: "Örnek Oda", location: "Pool Bar" },
  { id: "3", name: "Room 101", location: "Lobby Bar" },
];

export default function QRCodesPage() {
  const t = useTranslations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [qrLabel, setQrLabel] = useState("");
  const [rooms] = useState(mockRooms);

  const handleCreateQR = () => {
    console.log("[v0] Creating QR with:", {
      location: selectedLocation,
      label: qrLabel,
    });
    toast.success(t("common.success"));
    setIsDialogOpen(false);
    setSelectedLocation("");
    setQrLabel("");
  };

  const handleDownload = (roomId: string) => {
    console.log("[v0] Downloading QR for room:", roomId);
    toast.success("QR code downloaded");
  };

  const handleDelete = (roomId: string) => {
    console.log("[v0] Deleting QR for room:", roomId);
    toast.success("QR code deleted");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("qr.title")}</h1>
          <p className="text-muted-foreground">{t("qr.subtitle")}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("qr.create")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("qr.create")}</DialogTitle>
              <DialogDescription>{t("qr.subtitle")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="location">{t("qr.location")}</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder={t("qr.selectLocation")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sahil">Sahil</SelectItem>
                    <SelectItem value="pool-bar">Pool Bar</SelectItem>
                    <SelectItem value="lobby-bar">Lobby Bar</SelectItem>
                    <SelectItem value="rooms">Odalar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qr-label">{t("qr.label")}</Label>
                <Input
                  id="qr-label"
                  placeholder="QR Label"
                  value={qrLabel}
                  onChange={(e) => setQrLabel(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleCreateQR}>{t("common.create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Codes Grid */}
      {rooms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <QrCodeIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">{t("qr.noRooms")}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("qr.subtitle")}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{room.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(room.id)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">{t("qr.download")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("common.delete")}</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{room.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-lg border bg-muted p-8">
                  <div className="flex h-32 w-32 items-center justify-center rounded-md bg-background">
                    <QrCodeIcon className="h-24 w-24 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
