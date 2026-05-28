import { useState } from "react";
import { Camera, Mail, User, Shield, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormChangePass } from "@/components/profile/FormChangePass";
import { useAuth } from "@/context/AuthContext";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { useUpdateAvatar } from "@/hooks/profile/useUpdateAvatar";
import { toast } from "sonner";
import type { PasswordChange } from "@/schemes/profile";

const Profile = () => {
  const { user } = useAuth();
  const [preview, setPreview] = useState(user?.avatar);
  const [file, setFile] = useState<File | null>(null);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    if (!allowedTypes.includes(img.type)) {
      toast.error("Formato no permitido", {
        position: "top-center",
        duration: 4000,
      });
      return;
    }
    const MAX_SIZE = 2 * 1024 * 1024;
    if (img.size > MAX_SIZE) {
      toast.error("La imagen es muy pesada (máx 2MB)", {
        position: "top-center",
        duration: 4000,
      });
      return;
    }
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const updateAvatarMutation = useUpdateAvatar();

  const handleAvatarSubmit = () => {
    if (!file || !user) return;
    const promise = updateAvatarMutation.mutateAsync({ file, userId: user.id });
    toast.promise(promise, {
      loading: "Actualizando avatar...",
      success: "Avatar actualizado con éxito",
      error: (err) => err.message || "Error al actualizar el avatar",
      position: "top-center",
      duration: 4000,
    });
  };

  const changePasswordMutation = useChangePassword();
  const handleCP = (data: PasswordChange) => {
    const promise = changePasswordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      email: user?.email!,
    });
    toast.promise(promise, {
      loading: "Cambiando contraseña...",
      success: "Contraseña cambiada con éxito",
      error: (err) => err.message || "Error al cambiar la contraseña",
      position: "top-center",
      duration: 4000,
    });
  };

  return (
    <div className="bg-background/40 p-4 md:p-8 flex flex-col items-center gap-6 h-full overflow-y-auto w-full">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* ================= SECCIÓN AVATAR (Izquierda - Ocupa 5/12 cols) ================= */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col items-center justify-center bg-muted/20 dark:bg-muted/10 border-b lg:border-b-0 lg:border-r border-border/60">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-title text-foreground tracking-tight">
                Perfil de Usuario
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Gestiona tu identidad en la plataforma
              </p>
            </div>

            {/* Contenedor del Avatar Refinado */}
            <div className="relative group">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-background shadow-xl ring-1 ring-border/80 transition-all duration-300 group-hover:ring-primary/40">
                <img
                  src={
                    !preview
                      ? "https://i.pinimg.com/736x/56/fa/35/56fa35ecb5b0417a563b2dbe0fdbef7b.jpg"
                      : preview
                  }
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="Profile picture"
                />
              </div>

              {/* Botón flotante estilizado */}
              <label className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2.5 rounded-full cursor-pointer hover:scale-105 transition-all shadow-md border-2 border-background">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onAvatarChange}
                />
              </label>
            </div>

            {file && (
              <Button
                onClick={handleAvatarSubmit}
                size="sm"
                disabled={updateAvatarMutation.isPending}
                className="mt-6 w-full max-w-[140px] rounded-full shadow-sm font-semibold text-xs"
              >
                {updateAvatarMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            )}
          </div>

          {/* ================= SECCIÓN FORMULARIO / DETALLES (Derecha - Ocupa 7/12 cols) ================= */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Campo Nombre */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User size={14} className="text-muted-foreground/80" />
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Nombre Completo
                  </Label>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-sm font-semibold text-foreground">
                  {user?.name || "No especificado"}
                </div>
              </div>

              {/* Campo Email */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail size={14} className="text-muted-foreground/80" />
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Correo Electrónico
                  </Label>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-sm font-medium text-foreground truncate">
                  {user?.email}
                </div>
              </div>

              {/* Campo Teléfono */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone size={14} className="text-muted-foreground/80" />
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Teléfono / Celular
                  </Label>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-sm font-semibold text-foreground">
                  {user?.phone || (
                    <span className="text-muted-foreground/60 font-normal italic text-xs">
                      Sin registrar
                    </span>
                  )}
                </div>
              </div>

              {/* Campo Rol (Badge Premium Adaptativo) */}
              <div className="space-y-1.5 md:col-span-2 pt-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield size={14} className="text-muted-foreground/80" />
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Privilegios asignados
                  </Label>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/15 tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {user?.role || "Usuario"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENTE DE CAMBIO DE CONTRASEÑA */}
      <div className="w-full max-w-4xl mt-2">
        <FormChangePass funParent={handleCP} />
      </div>
    </div>
  );
};

export default Profile;
