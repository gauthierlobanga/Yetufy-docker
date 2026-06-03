import type { CartItem } from "./type";

export const cartItems: CartItem[] = [
  {
    id: 3,
    title: "Classic Hoodie",
    price: "$45.00",
    variant: "Black",
    size: "Medium",
    quantity: 1,
    image: "/images/products/list1.png",
    in_stock: true
  },
  {
    id: 4,
    title: "Denim Jacket",
    price: "$80.00",
    variant: "Blue",
    size: "Large",
    quantity: 2,
    image: "/images/products/list2.png",
    in_stock: false
  },
  {
    id: 5,
    title: "Slim Fit Jeans",
    price: "$50.00",
    variant: "Dark Wash",
    size: "32",
    quantity: 1,
    image: "/images/products/list3.png",
    in_stock: true
  }
];
