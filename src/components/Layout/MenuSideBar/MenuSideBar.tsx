import GroupItem from "../../Cart/GroupItem/GroupItem";
import { asset } from "../../../utils/asset";
import { useGroup, useUserData } from "../../../utils/store";
import { useMemo } from "react";

interface MenuSideBarProps {
  selectedGroup: number;
  onSelectGroup: (id: number) => void;
}

export default function MenuSideBar({
  selectedGroup,
  onSelectGroup,
}: MenuSideBarProps) {
  const icon = asset("/assets/icon.png");
  const GroupArr = useGroup((state) => state.groupArr);
  const userData = useUserData((state) => state.userData);

  const sortedGroups = useMemo(() => {
    return [...GroupArr].sort((a, b) => {
      const ao = a.order ?? 999;
      const bo = b.order ?? 999;

      if (ao !== bo) return ao - bo;
      return (a.id ?? 0) - (b.id ?? 0);
    });
  }, [GroupArr]);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <img
          src={
            userData?.cfgTotem?.dsImgLogo && userData.cfgTotem?.dsImgLogo.length
              ? userData.cfgTotem?.dsImgLogo
              : icon
          }
          alt="Logo do estabelecimento"
          className="size-32 rounded-xl"
        />
        <h1 className="font-bold text-2xl pb-3">Menu</h1>
      </div>

      <div className="flex flex-col items-start gap-2">
        {sortedGroups.map((group) => (
          <GroupItem
            key={group.id}
            id={group.id}
            name={group.name}
            selected={group.id === selectedGroup}
            onSelect={onSelectGroup}
          />
        ))}
      </div>
    </>
  );
}
