import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface CartActionButtonsProps {
  cartValue: number;
  currentStock: number;
  productId: string;
}

const CartActionButtons: React.FC<CartActionButtonsProps> = ({ cartValue, currentStock, productId }) => {

  // Update the cart in localStorage
  const updateLocalStorageCart = (id: string, quantity: number) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "{}");
    if (quantity > 0) {
      cartItems[id] = quantity;
    } else {
      delete cartItems[id];
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const handleCartDecrease = () => {
    if (cartValue > 0) {
      updateLocalStorageCart(productId, cartValue - 1);
    }
  };

  const handleCartIncrease = () => {
    if (currentStock > cartValue) {
      updateLocalStorageCart(productId, cartValue + 1);
    }
  };

  return (
    <div className="flex justify-between items-center gap-x-3.5 mt-3 rounded-full border  border-primary py-1.5 px-5 w-fit">
      <button
        title="Decrease"
        aria-label="Decrease"
        className={`disabled:text-gray-500 rounded-full ${cartValue === 0 ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={handleCartDecrease}
        disabled={cartValue === 0}
      >
        <AiOutlineMinus />
      </button>
      <div className="cart-val">{cartValue}4</div>
      <button
        title="Increase"
        aria-label="Increase"
        className={`rounded-full ${currentStock === 0 ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={handleCartIncrease}
        disabled={currentStock === 0}
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};

export default CartActionButtons;
