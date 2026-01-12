"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { credentialTypes, CredentialTypeId, CredentialTypeDefinition } from "./credentialTypes";
import { credentialIconMap } from "./CredentialIcons";

type Environment = "production" | "staging" | "development";

interface AddCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    type: CredentialTypeId;
    environment: Environment;
    fields: Record<string, string>;
    description?: string;
  }) => void;
  isSaving?: boolean;
}

const AddCredentialModal = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: AddCredentialModalProps) => {
  const [step, setStep] = useState<"type" | "fields">("type");
  const [selectedType, setSelectedType] = useState<CredentialTypeId | null>(null);
  const [environment, setEnvironment] = useState<Environment>("production");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [description, setDescription] = useState<string>("");

  if (!isOpen) return null;

  const selectedTypeDefinition = selectedType
    ? credentialTypes.find((t) => t.id === selectedType)
    : null;

  const handleTypeSelect = (typeId: CredentialTypeId) => {
    setSelectedType(typeId);
    setFieldValues({});
    setShowSecrets({});
    setDescription("");
    setStep("fields");
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBack = () => {
    setStep("type");
    setSelectedType(null);
    setFieldValues({});
  };

  const handleSave = () => {
    if (!selectedType) return;
    onSave({
      type: selectedType,
      environment,
      fields: fieldValues,
      description: description || undefined,
    });
  };

  const handleClose = () => {
    setStep("type");
    setSelectedType(null);
    setFieldValues({});
    setDescription("");
    setEnvironment("production");
    onClose();
  };

  const isFormValid = () => {
    if (!selectedTypeDefinition) return false;
    return selectedTypeDefinition.fields
      .filter((f) => f.required)
      .every((f) => fieldValues[f.key]?.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#282828]/90"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden rounded-4xl bg-b-surface1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stroke-subtle">
          <div className="flex items-center gap-3">
            {step === "fields" && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface2 fill-t-secondary hover:fill-t-primary transition-colors"
              >
                <Icon className="!w-4 !h-4" name="arrow-left" />
              </button>
            )}
            <h3 className="text-h4">
              {step === "type" ? "Add Credential" : selectedTypeDefinition?.label}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface2 fill-t-secondary hover:fill-t-primary transition-colors"
          >
            <Icon className="!w-4 !h-4" name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "type" ? (
            <TypeSelectionStep
              onSelect={handleTypeSelect}
              selectedType={selectedType}
            />
          ) : (
            selectedTypeDefinition && (
              <FieldsStep
                typeDefinition={selectedTypeDefinition}
                environment={environment}
                onEnvironmentChange={setEnvironment}
                fieldValues={fieldValues}
                onFieldChange={handleFieldChange}
                showSecrets={showSecrets}
                onToggleSecret={toggleSecretVisibility}
                description={description}
                onDescriptionChange={setDescription}
              />
            )
          )}
        </div>

        {/* Footer */}
        {step === "fields" && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-stroke-subtle">
            <Button isStroke onClick={handleClose}>
              Cancel
            </Button>
            <Button
              isPrimary
              onClick={handleSave}
              disabled={!isFormValid() || isSaving}
            >
              {isSaving ? "Saving..." : "Save Credential"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 1: Type Selection
const TypeSelectionStep = ({
  onSelect,
  selectedType,
}: {
  onSelect: (typeId: CredentialTypeId) => void;
  selectedType: CredentialTypeId | null;
}) => {
  return (
    <div>
      <p className="text-small text-t-secondary mb-4">
        Select the type of credential you want to add
      </p>
      <div className="grid grid-cols-2 gap-3">
        {credentialTypes.map((type) => {
          const IconComponent = credentialIconMap[type.id];
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`flex flex-col items-center p-5 rounded-2xl text-center transition-all ${
                selectedType === type.id
                  ? "bg-primary1/10 border-2 border-primary1"
                  : "bg-b-surface2 border-2 border-transparent hover:border-stroke-subtle hover:shadow-sm"
              }`}
            >
              <div className={`flex items-center justify-center size-12 rounded-2xl border-[1.5px] ${type.borderColor} ${type.bgColor} mb-3`}>
                {IconComponent && <IconComponent className={`w-6 h-6 ${type.iconColor.replace('fill-', 'text-')}`} />}
              </div>
              <div className="text-body-bold text-t-primary mb-1">
                {type.label}
              </div>
              <div className="text-xs text-t-tertiary line-clamp-2">{type.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Step 2: Fields Entry
const FieldsStep = ({
  typeDefinition,
  environment,
  onEnvironmentChange,
  fieldValues,
  onFieldChange,
  showSecrets,
  onToggleSecret,
  description,
  onDescriptionChange,
}: {
  typeDefinition: CredentialTypeDefinition;
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
  fieldValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
  showSecrets: Record<string, boolean>;
  onToggleSecret: (key: string) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
}) => {
  const environments: Environment[] = ["production", "staging", "development"];

  return (
    <div className="space-y-6">
      {/* Environment Selector */}
      <div>
        <label className="block text-small font-medium text-t-secondary mb-2">
          Environment
        </label>
        <div className="flex gap-2">
          {environments.map((env) => (
            <button
              key={env}
              onClick={() => onEnvironmentChange(env)}
              className={`px-4 py-2 rounded-xl text-small font-medium capitalize transition-all ${
                environment === env
                  ? "bg-primary1 text-white"
                  : "bg-b-surface2 text-t-secondary hover:text-t-primary hover:bg-b-surface1"
              }`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-small font-medium text-t-secondary mb-2">
          Description <span className="text-t-tertiary font-normal">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={`e.g., ${typeDefinition.description}`}
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary1/20 placeholder:text-t-tertiary"
        />
      </div>

      <div className="border-t border-stroke-subtle" />

      {/* Dynamic Fields */}
      {typeDefinition.fields.map((field) => (
        <div key={field.key}>
          <label className="flex items-center gap-2 text-small font-medium text-t-secondary mb-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
            {field.sensitive && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-amber-500/10 text-amber-600">
                Secret
              </span>
            )}
          </label>

          {field.type === "textarea" ? (
            <div className="relative">
              <textarea
                value={fieldValues[field.key] || ""}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.sensitive ? 4 : 3}
                className={`w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary1/20 placeholder:text-t-tertiary ${
                  field.sensitive && !showSecrets[field.key] ? "font-mono blur-sm hover:blur-none focus:blur-none" : ""
                }`}
              />
              {field.sensitive && (
                <button
                  type="button"
                  onClick={() => onToggleSecret(field.key)}
                  className="absolute top-3 right-3 flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                >
                  <Icon
                    className="!w-4 !h-4"
                    name={showSecrets[field.key] ? "eye-slash" : "eye"}
                  />
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <input
                type={
                  field.sensitive && !showSecrets[field.key]
                    ? "password"
                    : field.type === "password"
                    ? "text"
                    : field.type
                }
                value={fieldValues[field.key] || ""}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20 placeholder:text-t-tertiary pr-12"
              />
              {field.sensitive && (
                <button
                  type="button"
                  onClick={() => onToggleSecret(field.key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                >
                  <Icon
                    className="!w-4 !h-4"
                    name={showSecrets[field.key] ? "eye-slash" : "eye"}
                  />
                </button>
              )}
            </div>
          )}

          {field.helpText && (
            <p className="text-xs text-t-tertiary mt-1.5">{field.helpText}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddCredentialModal;
