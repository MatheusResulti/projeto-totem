import GroupItem from "../components/GroupItem";
import { useGroup, useUserData } from "../utils/store";

interface MenuSideBarProps {
  selectedGroup: number;
  onSelectGroup: (id: number) => void;
}

export default function MenuSideBar({
  selectedGroup,
  onSelectGroup,
}: MenuSideBarProps) {
  const GroupArr = useGroup((state) => state.groupArr);
  const userData = useUserData((state) => state.userData);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <img
          src={
            userData?.cfgTotem?.dsImgLogo && userData.cfgTotem?.dsImgLogo.length
              ? userData.cfgTotem?.dsImgLogo
              : "/assets/icon.png"
          }
          alt="Logo do estabelecimento"
          className="size-32 rounded-xl"
        />
        <h1 className="font-bold text-2xl pb-3">Menu</h1>
      </div>
      <div className="flex flex-col items-start">
        {GroupArr.map((group) => {
          return (
            <GroupItem
              key={group.id}
              id={group.id}
              name={group.name}
              selected={group.id === selectedGroup}
              onSelect={onSelectGroup}
            />
          );
        })}
      </div>
    </>
  );
}
