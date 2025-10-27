import GroupItem from "../components/GroupItem";
import { groupMock } from "../utils/mocks/groupMock";
import { userMock } from "../utils/mocks/userMock";

interface MenuSideBarProps {
  selectedGroup: number;
  onSelectGroup: (id: number) => void;
}

export default function MenuSideBar({
  selectedGroup,
  onSelectGroup,
}: MenuSideBarProps) {
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <img
          src={
            userMock?.logo && userMock.logo.length
              ? userMock.logo
              : "/assets/icon.png"
          }
          alt="Logo do estabelecimento"
          className="size-32"
        />
        <h1 className="font-bold text-xl pb-3">Menu</h1>
      </div>
      <div className="flex flex-col items-start">
        {groupMock.map((group) => {
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
