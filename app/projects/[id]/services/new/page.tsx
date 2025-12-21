import AddServicePage from "@/templates/AddServicePage";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <AddServicePage projectId={id} />;
}
