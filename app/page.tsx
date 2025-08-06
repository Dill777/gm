import React, { Suspense } from "react";
import { Metadata } from "next";
import Container from "@/ui/components/container";
import { getMetaDataByName } from "@/utils/meta-data";
import {
  GMDeployHeader,
  GMDeployTabs,
  GMDeploySidebar,
} from "@/ui/views/gm-deploy";
import TabletTabNavigation from "@/ui/views/gm-deploy/tablet-tab-navigation";
import { ReferUpdater } from "@/ui/views/landing";

export const metadata: Metadata = getMetaDataByName("home");

const GMDeployPage = ({
  searchParams,
}: {
  searchParams: { tabletTab?: string };
}) => {
  const activeTabletTab =
    searchParams.tabletTab === "Dashboard" ? "Dashboard" : "GM";

  return (
    <main>
      <div className="min-h-screen bg-body pt-[102px]">
        <Container className="flex gap-5">
          {/* Desktop Layout - Hidden on tablet_md and below */}
          <div className="tablet_md:hidden flex gap-5 w-full">
            <div className="flex-1 w-full py-8">
              <Suspense fallback={<div>Loading...</div>}>
                <GMDeployHeader />
              </Suspense>
              <GMDeployTabs />
            </div>
            <div className="w-[358px] px-5 py-6 border-x border-white/5 bg-white sticky top-[102px] h-[calc(100vh-102px)] overflow-y-scroll">
              <Suspense fallback={<div>Loading...</div>}>
                <GMDeploySidebar />
              </Suspense>
            </div>
          </div>

          {/* Tablet Layout - Only shown on tablet_md and below */}
          <div className="hidden tablet_md:block w-full py-8">
            {/* Tablet Tabs */}
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <GMDeployHeader />
                <TabletTabNavigation activeTab={activeTabletTab} />
              </Suspense>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTabletTab === "GM" && <GMDeployTabs />}
                {activeTabletTab === "Dashboard" && (
                  <div className="px-5 py-6 border border-white/5 bg-white rounded-2xl">
                    <Suspense fallback={<div>Loading...</div>}>
                      <GMDeploySidebar />
                    </Suspense>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Suspense>
        <ReferUpdater />
      </Suspense>
    </main>
  );
};

export default GMDeployPage;
