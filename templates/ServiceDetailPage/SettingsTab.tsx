"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { Service } from "@/types";
import { notificationSettings } from "./data";

interface SettingsTabProps {
    service: Service;
    onDeleteClick: () => void;
}

const SettingsTab = ({ service, onDeleteClick }: SettingsTabProps) => {
    return (
        <>
            {/* General Settings */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <h3 className="text-body-bold mb-4">General Settings</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-small font-medium text-t-secondary mb-2">
                            Service Name
                        </label>
                        <input
                            type="text"
                            defaultValue={service.name}
                            className="w-full max-w-md px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                    </div>
                    <div>
                        <label className="block text-small font-medium text-t-secondary mb-2">
                            Notes
                        </label>
                        <textarea
                            defaultValue={service.notes || ""}
                            placeholder="Add notes about this service..."
                            rows={3}
                            className="w-full max-w-md px-4 py-3 rounded-xl bg-b-surface1 text-body text-t-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                    </div>
                    <div>
                        <Button isPrimary>Save Changes</Button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="p-6 rounded-4xl bg-b-surface2">
                <h3 className="text-body-bold mb-4">Notifications</h3>
                <div className="space-y-4">
                    {notificationSettings.map((setting, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-stroke-subtle last:border-0">
                            <div>
                                <div className="text-small font-medium text-t-primary">{setting.label}</div>
                                <div className="text-xs text-t-tertiary">{setting.desc}</div>
                            </div>
                            <button
                                className={`relative w-11 h-6 rounded-full transition-colors ${
                                    setting.enabled ? "bg-primary1" : "bg-b-surface1"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                        setting.enabled ? "left-6" : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-4xl bg-b-surface2 border-2 border-red-500/20">
                <h3 className="text-body-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-small text-t-secondary mb-4">
                    These actions are irreversible. Please proceed with caution.
                </p>
                <div className="flex gap-3">
                    <Button 
                        isStroke 
                        className="!border-red-500/30 !text-red-500 hover:!bg-red-500/10"
                        onClick={onDeleteClick}
                    >
                        <Icon className="mr-2 !w-4 !h-4 fill-red-500" name="close" />
                        Remove Service
                    </Button>
                </div>
            </div>
        </>
    );
};

export default SettingsTab;
