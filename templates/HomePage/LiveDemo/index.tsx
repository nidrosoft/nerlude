"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

const steps = [
    {
        id: 1,
        title: "Create Your Project",
        description: "Start by creating a project for your product. Give it a name, pick an icon, and choose a template to get started quickly.",
        badge: "Step 1",
        badgeColor: "bg-primary1/10 text-primary1",
    },
    {
        id: 2,
        title: "Add Your Services",
        description: "Connect all the services you use—Stripe, Vercel, AWS, domains, and more. Choose from 100+ pre-configured integrations.",
        badge: "Step 2",
        badgeColor: "bg-primary2/10 text-primary2",
    },
    {
        id: 3,
        title: "Store Credentials Securely",
        description: "Save your API keys, passwords, and secrets with bank-level AES-256 encryption. Access them anytime, from anywhere.",
        badge: "Step 3",
        badgeColor: "bg-purple-500/10 text-purple-500",
    },
    {
        id: 4,
        title: "Set Renewal Alerts",
        description: "Never miss a renewal again. Set expiration dates and get notified 30, 14, 7, and 1 day before any service expires.",
        badge: "Step 4",
        badgeColor: "bg-cyan-500/10 text-cyan-500",
    },
    {
        id: 5,
        title: "View Your Dashboard",
        description: "See everything at a glance—all your projects, services, costs, and upcoming renewals in one beautiful dashboard.",
        badge: "Step 5",
        badgeColor: "bg-amber-500/10 text-amber-500",
    },
    {
        id: 6,
        title: "You're All Set!",
        description: "Congratulations! Your project is ready to go. Start managing your SaaS stack like a pro.",
        badge: "Complete",
        badgeColor: "bg-green-500/10 text-green-500",
    },
];

const LiveDemo = () => {
    const [activeStep, setActiveStep] = useState(1);

    const currentStep = steps.find(s => s.id === activeStep) || steps[0];

    return (
        <div id="demo" className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden scroll-mt-20">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-10 text-center max-md:text-left max-md:mb-8">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary1/10 text-primary1 text-button">
                                <span className="w-2 h-2 rounded-full bg-primary1"></span>
                                Interactive Demo
                            </div>
                            <h2 className="mb-4 text-h2">
                                See how Nerlude works
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Click through each step to explore how easy it is to organize your entire SaaS stack.
                            </p>
                        </div>
                        
                        <div className="relative p-1.5 border-[1.5px] border-stroke-subtle rounded-4xl">
                            <div className="rounded-3xl bg-b-surface2 overflow-hidden">
                                <div className="grid grid-cols-12 min-h-[500px] max-lg:grid-cols-1 max-lg:min-h-auto">
                                    {/* Left sidebar - Step navigation */}
                                    <div className="col-span-4 border-r border-stroke-subtle p-6 max-lg:col-span-1 max-lg:border-r-0 max-lg:border-b max-lg:p-4">
                                        <div className="space-y-2">
                                            {steps.map((step) => (
                                                <button
                                                    key={step.id}
                                                    onClick={() => setActiveStep(step.id)}
                                                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                                                        activeStep === step.id
                                                            ? "bg-b-surface1 border border-stroke-highlight shadow-sm"
                                                            : "hover:bg-b-surface1/50 border border-transparent"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-small font-bold transition-all duration-300 ${
                                                            activeStep === step.id
                                                                ? "bg-primary1 text-white"
                                                                : activeStep > step.id
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-b-surface3 text-t-tertiary"
                                                        }`}>
                                                            {activeStep > step.id ? (
                                                                <Icon className="!w-4 !h-4 fill-white" name="check" />
                                                            ) : (
                                                                step.id
                                                            )}
                                                        </div>
                                                        <span className={`text-body font-medium transition-colors ${
                                                            activeStep === step.id ? "text-t-primary" : "text-t-secondary"
                                                        }`}>
                                                            {step.title}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Progress indicator */}
                                        <div className="mt-6 pt-6 border-t border-stroke-subtle">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-small text-t-secondary">Progress</span>
                                                <span className="text-small font-medium text-t-primary">{activeStep} of {steps.length}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-b-surface3 overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full bg-primary1 transition-all duration-500"
                                                    style={{ width: `${(activeStep / steps.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Right content - Interactive preview */}
                                    <div className="col-span-8 p-8 max-lg:col-span-1 max-lg:p-6">
                                        <div className="h-full flex flex-col">
                                            {/* Step badge and title */}
                                            <div className="mb-6">
                                                <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-small font-medium ${currentStep.badgeColor}`}>
                                                    {currentStep.badge}
                                                </div>
                                                <h3 className="text-h4 mb-2">{currentStep.title}</h3>
                                                <p className="text-body text-t-secondary max-w-lg">
                                                    {currentStep.description}
                                                </p>
                                            </div>
                                            
                                            {/* Interactive preview area */}
                                            <div className="flex-1 rounded-2xl bg-b-surface1 border border-stroke-subtle overflow-hidden">
                                                {activeStep === 1 && <CreateProjectPreview />}
                                                {activeStep === 2 && <AddServicesPreview />}
                                                {activeStep === 3 && <CredentialsPreview />}
                                                {activeStep === 4 && <AlertsPreview />}
                                                {activeStep === 5 && <DashboardPreview />}
                                                {activeStep === 6 && <CelebrationPreview />}
                                            </div>
                                            
                                            {/* Navigation buttons */}
                                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-stroke-subtle">
                                                <Button
                                                    isStroke
                                                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                                                    disabled={activeStep === 1}
                                                    className={activeStep === 1 ? "opacity-50 cursor-not-allowed" : ""}
                                                >
                                                    Previous
                                                </Button>
                                                {activeStep < steps.length ? (
                                                    <Button
                                                        isStroke
                                                        onClick={() => setActiveStep(activeStep + 1)}
                                                    >
                                                        Next Step
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setActiveStep(1)}
                                                            className="text-primary1 text-body hover:underline"
                                                        >
                                                            Reset
                                                        </button>
                                                        <Button
                                                            isPrimary
                                                            as="link"
                                                            href="/signup"
                                                        >
                                                            Get Started Free
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-6 mt-8 max-md:gap-4">
                            <div className="flex items-center gap-2 text-small text-t-secondary">
                                <Icon className="!w-4 !h-4 fill-green-500" name="check" />
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2 text-small text-t-secondary">
                                <Icon className="!w-4 !h-4 fill-green-500" name="check" />
                                One free project forever
                            </div>
                            <div className="flex items-center gap-2 text-small text-t-secondary">
                                <Icon className="!w-4 !h-4 fill-green-500" name="check" />
                                Setup in 2 minutes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Step 1: Create Project Preview
const CreateProjectPreview = () => {
    const [projectName, setProjectName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("🚀");
    
    const icons = ["🚀", "💼", "🎨", "📱", "🛒", "🎮", "📊", "🔧"];
    
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stroke-subtle">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-small text-t-tertiary">New Project</span>
            </div>
            
            <div className="flex-1 space-y-6">
                <div>
                    <label className="block mb-2 text-small font-medium text-t-secondary">Project Icon</label>
                    <div className="flex gap-2 flex-wrap">
                        {icons.map((icon) => (
                            <button
                                key={icon}
                                onClick={() => setSelectedIcon(icon)}
                                className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all ${
                                    selectedIcon === icon
                                        ? "bg-primary1/10 border-2 border-primary1 scale-110"
                                        : "bg-b-surface2 border border-stroke-subtle hover:border-stroke-highlight"
                                }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block mb-2 text-small font-medium text-t-secondary">Project Name</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="My Awesome SaaS"
                        className="w-full px-4 py-3 rounded-xl bg-b-surface2 border border-stroke-subtle focus:border-primary1 focus:outline-none text-body placeholder:text-t-tertiary transition-colors"
                    />
                </div>
                
                <div>
                    <label className="block mb-2 text-small font-medium text-t-secondary">Template</label>
                    <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
                        {["SaaS Product", "E-commerce", "Mobile App"].map((template, i) => (
                            <div
                                key={template}
                                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                                    i === 0
                                        ? "bg-primary1/5 border-primary1 text-primary1"
                                        : "bg-b-surface2 border-stroke-subtle text-t-secondary hover:border-stroke-highlight"
                                }`}
                            >
                                <span className="text-small font-medium">{template}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {projectName && (
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedIcon}</span>
                        <div>
                            <p className="text-body font-medium text-t-primary">{projectName}</p>
                            <p className="text-small text-green-600">Ready to create!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Step 2: Add Services Preview
const AddServicesPreview = () => {
    const [selectedServices, setSelectedServices] = useState<string[]>(["stripe"]);
    
    const services = [
        { id: "stripe", name: "Stripe", icon: "💳", category: "Payments" },
        { id: "vercel", name: "Vercel", icon: "▲", category: "Hosting" },
        { id: "supabase", name: "Supabase", icon: "⚡", category: "Database" },
        { id: "aws", name: "AWS", icon: "☁️", category: "Cloud" },
        { id: "cloudflare", name: "Cloudflare", icon: "🔶", category: "CDN" },
        { id: "resend", name: "Resend", icon: "📧", category: "Email" },
    ];
    
    const toggleService = (id: string) => {
        setSelectedServices(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };
    
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stroke-subtle">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-small text-t-tertiary">Add Services</span>
            </div>
            
            <div className="flex-1">
                <div className="mb-4">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-b-surface2 border border-stroke-subtle">
                        <Icon className="!w-5 !h-5 fill-t-tertiary" name="search" />
                        <span className="text-body text-t-tertiary">Search 100+ services...</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                selectedServices.includes(service.id)
                                    ? "bg-primary1/5 border-primary1"
                                    : "bg-b-surface2 border-stroke-subtle hover:border-stroke-highlight"
                            }`}
                        >
                            <span className="text-xl">{service.icon}</span>
                            <div className="text-left">
                                <p className="text-body font-medium">{service.name}</p>
                                <p className="text-xs text-t-tertiary">{service.category}</p>
                            </div>
                            {selectedServices.includes(service.id) && (
                                <div className="ml-auto w-5 h-5 rounded-full bg-primary1 flex items-center justify-center">
                                    <Icon className="!w-3 !h-3 fill-white" name="check" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            {selectedServices.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-primary1/5 border border-primary1/20">
                    <p className="text-small text-primary1 font-medium">
                        {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
                    </p>
                </div>
            )}
        </div>
    );
};

// Step 3: Credentials Preview
const CredentialsPreview = () => {
    const [showSecret, setShowSecret] = useState(false);
    
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stroke-subtle">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-small text-t-tertiary">Stripe Credentials</span>
            </div>
            
            <div className="flex-1 space-y-4">
                <div className="p-4 rounded-xl bg-b-surface2 border border-stroke-subtle">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-small font-medium text-t-secondary">API Key (Live)</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs">Production</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded-lg bg-b-surface1 text-small font-mono text-t-primary">
                            sk_live_••••••••••••••••4242
                        </code>
                        <button className="p-2 rounded-lg hover:bg-b-surface1 transition-colors">
                            <Icon className="!w-4 !h-4 fill-t-tertiary" name="copy" />
                        </button>
                    </div>
                </div>
                
                <div className="p-4 rounded-xl bg-b-surface2 border border-stroke-subtle">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-small font-medium text-t-secondary">Secret Key</span>
                        <button 
                            onClick={() => setShowSecret(!showSecret)}
                            className="text-xs text-primary1 hover:underline"
                        >
                            {showSecret ? "Hide" : "Reveal"}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded-lg bg-b-surface1 text-small font-mono text-t-primary">
                            {showSecret ? "whsec_abc123xyz789..." : "whsec_••••••••••••••••"}
                        </code>
                        <button className="p-2 rounded-lg hover:bg-b-surface1 transition-colors">
                            <Icon className="!w-4 !h-4 fill-t-tertiary" name="copy" />
                        </button>
                    </div>
                </div>
                
                <div className="p-4 rounded-xl bg-b-surface2 border border-stroke-subtle">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-small font-medium text-t-secondary">Webhook URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded-lg bg-b-surface1 text-small font-mono text-t-primary truncate">
                            https://api.myapp.com/webhooks/stripe
                        </code>
                        <button className="p-2 rounded-lg hover:bg-b-surface1 transition-colors">
                            <Icon className="!w-4 !h-4 fill-t-tertiary" name="copy" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2">
                    <Icon className="!w-5 !h-5 fill-green-500" name="lock" />
                    <p className="text-small text-green-600 font-medium">
                        Encrypted with AES-256 encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

// Step 4: Alerts Preview
const AlertsPreview = () => {
    const [selectedDays, setSelectedDays] = useState([30, 7, 1]);
    
    const alertOptions = [
        { days: 30, label: "30 days before" },
        { days: 14, label: "14 days before" },
        { days: 7, label: "7 days before" },
        { days: 1, label: "1 day before" },
    ];
    
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stroke-subtle">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-small text-t-tertiary">Renewal Alerts</span>
            </div>
            
            <div className="flex-1 space-y-6">
                <div>
                    <label className="block mb-2 text-small font-medium text-t-secondary">Service</label>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-b-surface2 border border-stroke-subtle">
                        <span className="text-xl">🌐</span>
                        <div>
                            <p className="text-body font-medium">myapp.com</p>
                            <p className="text-xs text-t-tertiary">Domain • Namecheap</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label className="block mb-2 text-small font-medium text-t-secondary">Renewal Date</label>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-b-surface2 border border-stroke-subtle">
                        <Icon className="!w-5 !h-5 fill-t-tertiary" name="clock" />
                        <span className="text-body">March 15, 2026</span>
                        <span className="ml-auto px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-medium">
                            68 days left
                        </span>
                    </div>
                </div>
                
                <div>
                    <label className="block mb-2 text-small font-medium text-t-secondary">Alert me</label>
                    <div className="grid grid-cols-2 gap-2">
                        {alertOptions.map((option) => (
                            <button
                                key={option.days}
                                onClick={() => setSelectedDays(prev => 
                                    prev.includes(option.days) 
                                        ? prev.filter(d => d !== option.days)
                                        : [...prev, option.days]
                                )}
                                className={`p-3 rounded-xl border text-small font-medium transition-all ${
                                    selectedDays.includes(option.days)
                                        ? "bg-primary1/10 border-primary1 text-primary1"
                                        : "bg-b-surface2 border-stroke-subtle text-t-secondary hover:border-stroke-highlight"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-primary1/5 border border-primary1/20">
                <div className="flex items-center gap-2">
                    <Icon className="!w-5 !h-5 fill-primary1" name="bell" />
                    <p className="text-small text-primary1 font-medium">
                        You'll receive {selectedDays.length} alert{selectedDays.length > 1 ? "s" : ""} via email
                    </p>
                </div>
            </div>
        </div>
    );
};

// Step 5: Dashboard Preview
const DashboardPreview = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stroke-subtle">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-small text-t-tertiary">Dashboard</span>
            </div>
            
            <div className="flex-1 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-b-surface2 border border-stroke-subtle">
                        <p className="text-xs text-t-tertiary mb-1">Projects</p>
                        <p className="text-h5">3</p>
                    </div>
                    <div className="p-3 rounded-xl bg-b-surface2 border border-stroke-subtle">
                        <p className="text-xs text-t-tertiary mb-1">Services</p>
                        <p className="text-h5">24</p>
                    </div>
                    <div className="p-3 rounded-xl bg-b-surface2 border border-stroke-subtle">
                        <p className="text-xs text-t-tertiary mb-1">Monthly</p>
                        <p className="text-h5">$847</p>
                    </div>
                </div>
                
                {/* Projects list */}
                <div className="space-y-2">
                    <p className="text-small font-medium text-t-secondary">Your Projects</p>
                    {[
                        { name: "My SaaS App", icon: "🚀", services: 12, cost: "$456/mo" },
                        { name: "E-commerce Store", icon: "🛒", services: 8, cost: "$234/mo" },
                        { name: "Mobile App", icon: "📱", services: 4, cost: "$157/mo" },
                    ].map((project, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-b-surface2 border border-stroke-subtle hover:border-stroke-highlight transition-colors cursor-pointer">
                            <span className="text-xl">{project.icon}</span>
                            <div className="flex-1">
                                <p className="text-body font-medium">{project.name}</p>
                                <p className="text-xs text-t-tertiary">{project.services} services</p>
                            </div>
                            <span className="text-small text-t-secondary">{project.cost}</span>
                        </div>
                    ))}
                </div>
                
                {/* Upcoming alerts */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon className="!w-4 !h-4 fill-amber-500" name="bell" />
                        <p className="text-small font-medium text-amber-600">Upcoming Renewals</p>
                    </div>
                    <p className="text-xs text-amber-600/80">
                        myapp.com expires in 68 days • AWS bill due in 12 days
                    </p>
                </div>
            </div>
        </div>
    );
};

// Step 6: Celebration Preview with Confetti
const CelebrationPreview = () => {
    const [showConfetti, setShowConfetti] = useState(true);
    
    // Confetti pieces
    const confettiColors = [
        "bg-primary1", "bg-primary2", "bg-accent1", "bg-accent2", 
        "bg-green-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500"
    ];
    
    return (
        <div className="p-6 h-full flex flex-col relative overflow-hidden">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-3 h-3 rounded-sm ${confettiColors[i % confettiColors.length]} opacity-80`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                                animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}
            
            <style jsx>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(500px) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                {/* Success Icon */}
                <div className="mb-6 relative">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                            <Icon className="!w-8 !h-8 fill-white" name="check" />
                        </div>
                    </div>
                    {/* Sparkles */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-bounce">✨</div>
                    <div className="absolute -bottom-1 -left-3 w-5 h-5 text-primary1 animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</div>
                    <div className="absolute top-0 -left-4 w-4 h-4 text-primary2 animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</div>
                </div>
                
                <h3 className="text-h3 mb-3">You're All Set! 🎊</h3>
                <p className="text-body text-t-secondary max-w-sm mb-6">
                    Your project is ready to go live. You've successfully learned how to manage your entire SaaS stack with Nerlude.
                </p>
                
                {/* Achievement badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary1/10 text-primary1 text-small font-medium">
                        <Icon className="!w-4 !h-4 fill-primary1" name="check" />
                        Project Created
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary2/10 text-primary2 text-small font-medium">
                        <Icon className="!w-4 !h-4 fill-primary2" name="check" />
                        Services Added
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 text-green-500 text-small font-medium">
                        <Icon className="!w-4 !h-4 fill-green-500" name="check" />
                        Credentials Secured
                    </div>
                </div>
                
                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                    <div className="p-3 rounded-xl bg-b-surface2 border border-stroke-subtle text-center">
                        <p className="text-h5 text-primary1">1</p>
                        <p className="text-xs text-t-tertiary">Project</p>
                    </div>
                    <div className="p-3 rounded-xl bg-b-surface2 border border-stroke-subtle text-center">
                        <p className="text-h5 text-primary2">6</p>
                        <p className="text-xs text-t-tertiary">Services</p>
                    </div>
                    <div className="p-3 rounded-xl bg-b-surface2 border border-stroke-subtle text-center">
                        <p className="text-h5 text-green-500">3</p>
                        <p className="text-xs text-t-tertiary">Alerts Set</p>
                    </div>
                </div>
            </div>
            
            {/* Toast notification */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 text-white shadow-lg animate-bounce">
                <Icon className="!w-5 !h-5 fill-white" name="check" />
                <span className="text-small font-medium">Project ready to launch!</span>
            </div>
        </div>
    );
};

export default LiveDemo;
