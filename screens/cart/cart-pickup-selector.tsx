"use client";

import React from "react";
import { DEFAULT_PICKUP_STATIONS, type PickupStationOption } from "@/db/models/pickup-stations";
import { BiStore, BiCheckCircle, BiTimeFive, BiPhoneCall, BiMapPin } from "react-icons/bi";
import { useI18nStore } from "@/lib/i18n/store";

interface CartPickupSelectorProps {
  selectedStation: PickupStationOption | null;
  onSelectStation: (station: PickupStationOption) => void;
}

export default function CartPickupSelector({
  selectedStation,
  onSelectStation,
}: CartPickupSelectorProps) {
  const { t } = useI18nStore();
  return (
    <div className="border border-gray-200 rounded-xl p-5 sm:p-6 mt-6 bg-white shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <BiStore className="text-xl text-primary" />
        <h3 className="text-lg font-bold text-slate-900">
          {t("cart.pickup.selectHeading")}
        </h3>
        <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {t("cart.pickup.freeBadge")}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-5">{t("cart.pickup.description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {DEFAULT_PICKUP_STATIONS.map((station) => {
          const isSelected = selectedStation?.id === station.id;
          return (
            <div
              key={station.id}
              onClick={() => onSelectStation(station)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-colors relative flex flex-col justify-between ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {station.name}
                  </h4>
                  {isSelected && (
                    <BiCheckCircle className="text-primary text-lg flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-start gap-1.5">
                    <BiMapPin className="text-gray-400 text-sm flex-shrink-0 mt-0.5" />
                    <span>{station.address}, {station.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BiTimeFive className="text-gray-400 text-sm flex-shrink-0" />
                    <span>{station.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BiPhoneCall className="text-gray-400 text-sm flex-shrink-0" />
                    <span>{station.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold">{t("cart.pickup.handlingFree")}</span>
                <span className="text-gray-400 text-[11px]">{t("cart.pickup.readyIn")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
