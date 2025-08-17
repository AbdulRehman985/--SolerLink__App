import React from "react";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGettopProductQuery } from "../../redux/api/ProductApiSlice";
import {
  FaStore,
  FaClock,
  FaStar,
  FaBoxOpen,
  FaRegCommentDots,
  FaShoppingCart,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute -right-8 top-1/2 transform -translate-y-1/2 
               bg-pink-600 hover:bg-pink-500 text-white p-4 rounded-full 
               shadow-lg cursor-pointer transition scale-90 hover:scale-110 z-10"
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute -left-8 top-1/2 transform -translate-y-1/2 
               bg-pink-600 hover:bg-pink-500 text-white p-4 rounded-full 
               shadow-lg cursor-pointer transition scale-90 hover:scale-110 z-10"
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
);

const ProductCorsul = () => {
  const { data: products, error, isLoading } = useGettopProductQuery();

  const settings = {
    dots: true,
    appendDots: (dots) => (
      <div className="p-2">
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-500 hover:bg-pink-500 transition" />
    ),
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="h-[20rem] w-full flex justify-center items-center text-white">
        Loading carousel...
      </div>
    );
  }

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || error?.message}
      </Message>
    );
  }

  return (
    <div className="mb-8">
      <Slider
        {...settings}
        className="xl:w-[30rem] lg:w-[28rem] md:w-[26rem] sm:w-full"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-[#1A1A1A]/95 border border-gray-700 
                       relative text-white rounded-2xl 
                       shadow-md hover:shadow-pink-500/30 
                       transition-all duration-500 p-5 hover:-translate-y-1"
          >
            {/* Wishlist Icon */}
            <div className="absolute top-3 right-3">
              <HeartIcon product={product} />
            </div>

            {/* Product Image */}
            <img
              loading="lazy"
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl mb-4 
                         transform hover:scale-[1.02] transition duration-500"
            />

            {/* Product Name */}
            <h2 className="text-xl font-semibold truncate mb-2 hover:text-pink-400 transition">
              {product.name}
            </h2>

            {/* Price */}
            <p className="text-pink-400 font-bold text-lg mb-2">
              ${product.price}
            </p>

            {/* Short Description */}
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              {product.description?.length > 100
                ? product.description.substring(0, 100) + "..."
                : product.description}
            </p>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaStore /> {product.brand}
              </div>
              <div className="flex items-center gap-2">
                <FaClock /> {moment(product.createdAt).fromNow()}
              </div>
              <div className="flex items-center gap-2">
                <FaBoxOpen /> Stock: {product.countInStock}
              </div>
              <div className="flex items-center gap-2">
                <FaRegCommentDots /> {product.numReviews} reviews
              </div>
              <div className="flex items-center gap-2">
                <FaShoppingCart /> Qty: {product.quantity}
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <FaStar className="text-yellow-400" /> Rating: {product.rating}
                /5
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCorsul;
