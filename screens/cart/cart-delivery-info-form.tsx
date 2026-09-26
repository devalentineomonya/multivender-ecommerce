import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import deliveryInfoInputs from "./delivery-info";

// Define the validation schema using Zod
const validationSchema = z.object({
  firstName: z
    .string()
    .min(3, "First Name must be at least 3 characters")
    .nonempty("First Name is required"),
  lastName: z
    .string()
    .min(3, "Last Name must be at least 3 characters")
    .nonempty("Last Name is required"),
  address: z.string().nonempty("Address is required"),
  town: z.string().nonempty("Town is required"),
  zip: z
    .string()
    .length(5, "ZIP must be exactly 5 digits")
    .regex(/^[0-9]{5}$/, "ZIP must be exactly 5 digits")
    .nonempty("ZIP is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  number: z
    .string()
    .length(10, "Phone Number must be exactly 10 digits")
    .regex(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits")
    .nonempty("Phone Number is required"),
});

// Infer the type from the validation schema
type FormValues = z.infer<typeof validationSchema>;

const CartDeliveryInfoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      town: "",
      zip: "",
      email: "",
      number: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log(values);
  };

  return (
    <div className="border border-gray-200 rounded-md p-6 mt-6">
      <form onSubmit={handleSubmit(onSubmit)} method="post">
        <div className="flex justify-between items-center py-6">
          <h5 className="text-slate-600 font-bold text-2xl">
            Delivery Information
          </h5>
          <button
            type="submit"
            title="Save Information"
            aria-label="Save Information"
            className="px-4 py-2 bg-gray-100 rounded-full font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Save Information
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {deliveryInfoInputs?.slice(0, 2)?.map(({ name, label, type }) => (
            <div key={name} className="flex flex-col mt-3">
              <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                autoComplete="true"
                id={name}
                {...register(name as keyof FormValues)}
                type={type ?? "text"}
                placeholder="Type here... "
                className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
              />
              {errors[name as keyof FormValues] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[name as keyof FormValues]?.message}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full">
          {deliveryInfoInputs?.slice(2, 3)?.map(({ name, label, type }) => (
            <div key={name} className="flex flex-col mt-3">
              <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                autoComplete="true"
                id={name}
                {...register(name as keyof FormValues)}
                type={type ?? "text"}
                placeholder="Type here... "
                className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
              />
              {errors[name as keyof FormValues] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[name as keyof FormValues]?.message}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {deliveryInfoInputs
            ?.slice(3, deliveryInfoInputs.length)
            ?.map(({ name, label, type }) => (
              <div key={name} className="flex flex-col mt-3">
                <label htmlFor={name} className="text-sm font-medium text-slate-700">
                  {label}
                </label>
                <input
                  autoComplete="true"
                  id={name}
                  {...register(name as keyof FormValues)}
                  type={type ?? "text"}
                  placeholder="Type here... "
                  className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
                />
                {errors[name as keyof FormValues] && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors[name as keyof FormValues]?.message}
                  </div>
                )}
              </div>
            ))}
        </div>
      </form>
    </div>
  );
};

export default CartDeliveryInfoForm;
