import { Alert } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

type Props = {
    alerts: Alert[];
    onDismiss?: (id: string) => void;
    onSnooze?: (id: string) => void;
};

const priorityStyles = {
    high: {
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        iconColor: "fill-red-500",
    },
    medium: {
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        iconColor: "fill-amber-500",
    },
    low: {
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        iconColor: "fill-green-500",
    },
};

const AlertsSection = ({ alerts, onDismiss, onSnooze }: Props) => {
    const activeAlerts = alerts.filter((a) => !a.isDismissed);

    return (
        <div className="h-full p-5 rounded-4xl bg-b-surface2 max-md:p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-body-bold">Needs Attention</h2>
                <span className="text-small text-t-tertiary">
                    {activeAlerts.length} item{activeAlerts.length !== 1 ? "s" : ""}
                </span>
            </div>
            {activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex items-center justify-center size-12 mb-3 rounded-2xl bg-green-500/10 fill-green-500">
                        <Icon name="check" className="!w-6 !h-6" />
                    </div>
                    <p className="text-small text-t-secondary">All caught up!</p>
                    <p className="text-xs text-t-tertiary mt-1">No items need your attention</p>
                </div>
            ) : (
            <div className="space-y-3">
                {activeAlerts.map((alert) => {
                    const styles = priorityStyles[alert.priority];
                    return (
                        <div
                            key={alert.id}
                            className="flex items-center p-4 rounded-2xl bg-b-surface1 max-md:flex-col max-md:items-start max-md:gap-3"
                        >
                            <div className="flex items-center flex-1 min-w-0">
                                <div className={`flex items-center justify-center w-10 h-10 mr-4 rounded-2xl border-[1.5px] shrink-0 ${styles.bgColor} ${styles.borderColor} ${styles.iconColor}`}>
                                    <Icon
                                        name={alert.type === "renewal" ? "generation" : "bulb"}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-t-primary truncate">
                                        {alert.title}
                                    </div>
                                    <div className="text-small text-t-secondary truncate">
                                        {alert.message}
                                        {alert.projectName && (
                                            <span className="ml-2 text-t-tertiary">
                                                • {alert.projectName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4 shrink-0 max-md:ml-0 max-md:w-full">
                                {onSnooze && (
                                    <Button
                                        className="max-md:flex-1"
                                        isPrimary
                                        onClick={() => onSnooze(alert.id)}
                                    >
                                        Snooze
                                    </Button>
                                )}
                                {onDismiss && (
                                    <Button
                                        className="max-md:flex-1"
                                        isSecondary
                                        onClick={() => onDismiss(alert.id)}
                                    >
                                        Dismiss
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default AlertsSection;
