"use client";

import { useState, useMemo } from "react";
import Button from "@/components/Button";

const ROICalculator = () => {
    const [services, setServices] = useState(10);
    const [hourlyRate, setHourlyRate] = useState(75);
    const [hoursPerMonth, setHoursPerMonth] = useState(5);

    const savings = useMemo(() => {
        const timeValue = hoursPerMonth * hourlyRate;
        const missedRenewals = services * 0.1 * 50;
        const totalMonthly = timeValue + missedRenewals;
        const totalYearly = totalMonthly * 12;
        return { monthly: totalMonthly, yearly: totalYearly, hours: hoursPerMonth };
    }, [services, hourlyRate, hoursPerMonth]);

    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-10 text-center max-md:text-left max-md:mb-8">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 text-accent text-button">
                                <span className="w-2 h-2 rounded-full bg-accent"></span>
                                ROI Calculator
                            </div>
                            <h2 className="mb-4 text-h2">
                                Calculate your savings
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                See how much time and money you could save with Nerlude.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 max-lg:grid-cols-1">
                            <div className="p-8 rounded-3xl bg-b-surface2 border border-stroke-subtle max-md:p-6 flex flex-col">
                                <h3 className="mb-8 text-body-lg-bold">Your Setup</h3>
                                
                                <div className="space-y-10 flex-1">
                                    <div>
                                        <div className="flex justify-between mb-3">
                                            <label className="text-body text-t-secondary">Number of services</label>
                                            <span className="text-body font-medium text-t-primary">{services}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={services}
                                            onChange={(e) => setServices(Number(e.target.value))}
                                            className="w-full h-3 rounded-full bg-b-surface3 appearance-none cursor-pointer accent-primary1"
                                        />
                                        <div className="flex justify-between mt-2 text-small text-t-tertiary">
                                            <span>1</span>
                                            <span>50</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-3">
                                            <label className="text-body text-t-secondary">Your hourly rate ($)</label>
                                            <span className="text-body font-medium text-t-primary">${hourlyRate}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="25"
                                            max="250"
                                            step="5"
                                            value={hourlyRate}
                                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                                            className="w-full h-3 rounded-full bg-b-surface3 appearance-none cursor-pointer accent-primary1"
                                        />
                                        <div className="flex justify-between mt-2 text-small text-t-tertiary">
                                            <span>$25</span>
                                            <span>$250</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-3">
                                            <label className="text-body text-t-secondary">Hours managing services/month</label>
                                            <span className="text-body font-medium text-t-primary">{hoursPerMonth}h</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={hoursPerMonth}
                                            onChange={(e) => setHoursPerMonth(Number(e.target.value))}
                                            className="w-full h-3 rounded-full bg-b-surface3 appearance-none cursor-pointer accent-primary1"
                                        />
                                        <div className="flex justify-between mt-2 text-small text-t-tertiary">
                                            <span>1h</span>
                                            <span>20h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary1/10 to-primary2/10 border border-primary1/20 max-md:p-6">
                                <h3 className="mb-6 text-body-lg-bold">Your Potential Savings</h3>
                                
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-b-surface1/50">
                                        <div className="text-small text-t-secondary mb-1">Monthly Savings</div>
                                        <div className="text-h2 text-primary1">${savings.monthly.toLocaleString()}</div>
                                    </div>
                                    
                                    <div className="p-4 rounded-2xl bg-b-surface1/50">
                                        <div className="text-small text-t-secondary mb-1">Yearly Savings</div>
                                        <div className="text-h1 text-primary2">${savings.yearly.toLocaleString()}</div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-b-surface1/50">
                                        <div className="text-small text-t-secondary mb-1">Time Saved Per Month</div>
                                        <div className="text-h3 text-accent">{Math.round(savings.hours * 0.8)} hours</div>
                                        <div className="text-xs text-t-tertiary mt-1">Based on 80% efficiency improvement</div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-6"
                                    isPrimary
                                    as="link"
                                    href="/signup"
                                >
                                    Start Saving Today
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ROICalculator;
