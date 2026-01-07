import ServiceDetailPage from "@/templates/ServiceDetailPage";

type Props = {
    params: Promise<{ id: string; serviceId: string }>;
};

export default async function Page({ params }: Props) {
    const { id, serviceId } = await params;
    return <ServiceDetailPage projectId={id} serviceId={serviceId} />;
}
