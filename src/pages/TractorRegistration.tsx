import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Hash,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Gauge,
  Fuel,
} from "lucide-react";
import { toast } from "sonner";

interface FormData {
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  model: string;
  tractorNumber: string;
  horsepower: string;
  fuelType: string;
  rentPerHour: string;
  rentPerDay: string;
  isAvailable: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const TractorRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    model: "",
    tractorNumber: "",
    horsepower: "",
    fuelType: "Diesel",
    rentPerHour: "",
    rentPerDay: "",
    isAvailable: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.tractorNumber.trim())
      newErrors.tractorNumber = "Tractor number is required";

    if (!formData.horsepower || Number(formData.horsepower) <= 0)
      newErrors.horsepower = "Invalid horsepower";

    if (!formData.rentPerHour || Number(formData.rentPerHour) <= 0)
      newErrors.rentPerHour = "Invalid hourly rate";

    if (!formData.rentPerDay || Number(formData.rentPerDay) <= 0)
      newErrors.rentPerDay = "Invalid daily rate";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler (FIXED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tractors/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          // ✅ IMPORTANT: convert numbers
          body: JSON.stringify({
            ownerName: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            model: formData.model,
            tractorNumber: formData.tractorNumber,
            horsepower: Number(formData.horsepower),
            fuelType: formData.fuelType,
            rentPerHour: Number(formData.rentPerHour),
            rentPerDay: Number(formData.rentPerDay),
            isAvailable: formData.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("🚜 Tractor registered successfully!");
      navigate("/tractors");
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error(error.message || "Backend not reachable");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Input handler
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          Register Your Tractor
        </h1>
        <p className="text-muted-foreground mt-1">
          List your tractor for rent and start earning
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner Details Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Owner Details
            </h3>
            <div className="space-y-4">
              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Owner Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`input-field pl-12 ${errors.ownerName ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.ownerName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className={`input-field pl-12 ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`input-field pl-12 ${errors.phone ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                    className={`input-field pl-12 ${errors.location ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tractor Details Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Tractor Details
            </h3>
            <div className="space-y-4">
              {/* Tractor Model */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tractor Model *
                </label>
                <div className="relative">
                  <Tractor className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Mahindra 575 DI"
                    className={`input-field pl-12 ${errors.model ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.model && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.model}
                  </p>
                )}
              </div>

              {/* Tractor Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tractor Number *
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.tractorNumber}
                    onChange={(e) => handleInputChange('tractorNumber', e.target.value)}
                    placeholder="e.g., PB-10-AB-1234"
                    className={`input-field pl-12 ${errors.tractorNumber ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.tractorNumber && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.tractorNumber}
                  </p>
                )}
              </div>

              {/* Horsepower */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Horsepower (HP) *
                </label>
                <div className="relative">
                  <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.horsepower}
                    onChange={(e) => handleInputChange('horsepower', e.target.value)}
                    placeholder="e.g., 47"
                    min="0"
                    className={`input-field pl-12 ${errors.horsepower ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.horsepower && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.horsepower}
                  </p>
                )}
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fuel Type *
                </label>
                <div className="relative">
                  <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <select
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className={`input-field pl-12 ${errors.fuelType ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Bio-Diesel">Bio-Diesel</option>
                  </select>
                </div>
                {errors.fuelType && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.fuelType}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rent Per Hour */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rent per Hour (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.rentPerHour}
                    onChange={(e) => handleInputChange('rentPerHour', e.target.value)}
                    placeholder="500"
                    min="0"
                    className={`input-field pl-12 ${errors.rentPerHour ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.rentPerHour && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.rentPerHour}
                  </p>
                )}
              </div>

              {/* Rent Per Day */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rent per Day (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.rentPerDay}
                    onChange={(e) => handleInputChange('rentPerDay', e.target.value)}
                    placeholder="3500"
                    min="0"
                    className={`input-field pl-12 ${errors.rentPerDay ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                      }`}
                  />
                </div>
                {errors.rentPerDay && (
                  <p className="text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.rentPerDay}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Availability Status</h3>
                <p className="text-sm text-muted-foreground">
                  Set your tractor as available for rent
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('isAvailable', !formData.isAvailable)}
                className={`relative w-14 h-7 rounded-full transition-colors ${formData.isAvailable ? 'bg-success' : 'bg-muted'
                  }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all ${formData.isAvailable ? 'left-7' : 'left-0.5'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Registering...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Register Tractor
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TractorRegistration;
