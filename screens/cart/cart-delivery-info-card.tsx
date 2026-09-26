const CartDeliveryInfoCard = () => {
  return (
    <div className="border border-gray-200 rounded-md p-6 mt-6">
      <div className="flex justify-between items-center py-0">
        <h5 className="text-slate-600 font-bold text-2xl">
          Delivery Information
        </h5>
        <button
          type="submit"
          title="Edit Information"
          aria-label="Edit Information"
          className="px-4 py-2 bg-gray-100 rounded-full font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="mt-4">
        <h5 className="text-sm font-semibold text-slate-900">Valentine Omonya</h5>
        <p className="text-xs text-gray-600 mt-1">4443 Parker Rd, Allentown, New Mexico 31134</p>
        <p className="text-xs text-gray-600 mt-1">+254768133220</p>
        <p className="text-xs text-gray-600 mt-1">valomosh254@gmail.com</p>
      </div>
    </div>
  );
};

export default CartDeliveryInfoCard;
