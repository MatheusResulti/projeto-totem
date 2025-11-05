import { useUserData } from "../utils/store";

export function useTotemColor() {
  const userData = useUserData((s) => s.userData);

  const primary = userData?.cfgTotem?.cdCorPrimaria?.length
    ? userData.cfgTotem.cdCorPrimaria
    : "var(--color-secondary)";

  const secondary = userData?.cfgTotem?.cdCorSecundaria?.length
    ? userData.cfgTotem.cdCorSecundaria
    : "var(--color-primary)";

  return { primary, secondary };
}
