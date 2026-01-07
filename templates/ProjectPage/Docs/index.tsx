"use client";

import { DocsProvider } from "./DocsContext";
import DocsSidebar from "./DocsSidebar";
import DocsEditor from "./DocsEditor";
import NewDocModal from "./NewDocModal";
import DeleteDocModal from "./DeleteDocModal";
import { useDocsContext } from "./DocsContext";

type Props = {
    projectId: string;
    showNewDocModal?: boolean;
    onCloseNewDocModal?: () => void;
};

const DocsContent = () => {
    const { isExpanded } = useDocsContext();
    
    return (
        <>
            <div className={isExpanded ? "fixed inset-0 z-50 bg-b-surface1 p-6 overflow-auto" : ""}>
                <div className="flex gap-6 max-md:flex-col">
                    <DocsSidebar />
                    <DocsEditor />
                </div>
            </div>
            <NewDocModal />
            <DeleteDocModal />
        </>
    );
};

const Docs = ({ projectId, showNewDocModal = false, onCloseNewDocModal }: Props) => {
    return (
        <DocsProvider projectId={projectId} externalShowNewDocModal={showNewDocModal} onExternalCloseNewDocModal={onCloseNewDocModal}>
            <DocsContent />
        </DocsProvider>
    );
};

export default Docs;
