"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiFilter } from "react-icons/bi";
import { motion } from "framer-motion";
import MainLayout from "../main/main-layout";

// Filter Configurations
const filterConfig = [
  {
    name: "Price",
    key: "price",
    options: [
      { value: "0-25", label: "$0 - $25" },
      { value: "25-50", label: "$25 - $50" },
      { value: "50-75", label: "$50 - $75" },
      { value: "75+", label: "$75+" },
    ],
  },
  {
    name: "Color",
    key: "color",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
    ],
  },
  {
    name: "Size",
    key: "size",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
    ],
  },
];

// Zod schema for validation
const filterSchema = z.object({
  price: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export default function ScalableFilters() {
  const { control, handleSubmit, watch, reset } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      price: [],
      color: [],
      size: [],
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterFormValues>({});
  const watchFilters = watch();

  const onSubmit = (data: FilterFormValues) => {
    setSelectedFilters(data);
    console.log("Applied Filters:", data);
  };

  const clearFilters = () => {
    reset();
    setSelectedFilters({});
  };

  const selectedFilterCount = Object.values(watchFilters)
    .flat()
    .filter(Boolean).length;

  const toggleFilter = () => setIsOpen((prev) => !prev);

  return (
    <MainLayout className="bg-white mt-3">
      <section
        aria-labelledby="filter-heading"
        className="relative z-10 border-t border-b border-gray-200 grid items-center"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4">
          <div className="w-full flex items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleFilter}
              className="group text-gray-700 font-medium flex items-center"
            >
              <BiFilter
                className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Filters
            </button>
            <div className="pl-6 w-fit">
              <button
                type="button"
                onClick={clearFilters}
                className="text-gray-500 whitespace-nowrap"
              >
                Clear all
              </button>
            </div>
            <div className="pl-6 flex justify-end md:justify-between items-center w-full ">
              <ul className="flex max-md:flex-col gap-4 max-md:hidden ">
                {Object.entries(selectedFilters).map(([key, values]) =>
                  values?.length ? (
                    <li key={key}>
                      <strong>{key}:</strong> {values.join(", ")}
                    </li>
                  ) : null
                )}
              </ul>
              <h3 className="font-medium text-gray-900">
                Selected Filters ({selectedFilterCount})
              </h3>
            </div>
          </div>
        </div>

        {/* Animated Disclosure Panel */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          className="overflow-hidden border-t border-gray-200"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="py-10"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8"
            >
              {filterConfig.map((filter) => (
                <fieldset key={filter.key}>
                  <legend className="block font-medium">{filter.name}</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filter.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <Controller
                          name={filter.key as "price" | "color" | "size" | `price.${number}` | `color.${number}` | `size.${number}`}
                          control={control}
                          render={({ field }) => {
                            const currentValue = Array.isArray(field.value) ? field.value : [];
                            return (
                              <input
                                id={`${filter.key}-${option.value}`}
                                value={option.value}
                                type="checkbox"
                                className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                checked={currentValue.includes(option.value)}
                                onChange={() =>
                                  field.onChange(
                                    currentValue.includes(option.value)
                                      ? currentValue.filter(item => item !== option.value)
                                      : [...currentValue, option.value]
                                  )
                                }
                              />
                            );
                          }}
                        />
                        <label
                          htmlFor={`${filter.key}-${option.value}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))}
              <div className="col-span-2 flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
