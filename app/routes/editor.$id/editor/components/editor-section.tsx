import { ScrollArea } from "@/components/ui/scroll-area";
import { MacOSActions } from "./macos-actions";
import { AsideSettings, AsideSettingsMobile } from "./aside-settings";
import { AsideScreens, AsideScreensMobile } from "./aside-screens";
import { CurrentScreen } from "./current-screen";

export function EditorSection() {
  return (
    <main className="xl:flex justify-center">
      <ScreensSection />
      <MainSection />
      <SettingsSection />
    </main>
  );
}

function ScreensSection() {
  return (
    <aside className="h-[calc(100vh_-_3rem)] hidden xl:flex w-full flex-1 justify-center ">
      <div className="bg-accent rounded-md w-full justify-center">
        <ScrollArea className="h-[calc(100vh_-_3rem)]">
          <AsideScreens />
        </ScrollArea>
      </div>
    </aside>
  );
}

function MainSection() {
  return (
    <div className="h-[calc(100vh_-_3rem)] short:w-[900px] 2xl:w-[1200px]">
      <div className="xl:flex gap-3 hidden mt-4 ml-4 absolute z-10">
        <MacOSActions />
      </div>
      <ScrollArea className="h-[calc(100vh_-_3rem)]">
        <div className="flex justify-between">
          <AsideScreensMobile />
          <AsideSettingsMobile />
        </div>
        <CurrentScreen />
      </ScrollArea>
    </div>
  );
}

function SettingsSection() {
  return (
    <aside className="h-[calc(100vh_-_3rem)] hidden xl:flex flex-1 w-full justify-center">
      <div className="bg-accent rounded-md w-full justify-center">
        <AsideSettings />
      </div>
    </aside>
  );
}
