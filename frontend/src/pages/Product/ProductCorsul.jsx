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

const ProductCorsul = () => {
  const { data: products, error, isLoading } = useGettopProductQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
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
      <Message varient="danger">
        {error?.data?.message || error?.message}
      </Message>
    );
  }

  return (
    <div className="mb-8 xl:block lg:block md:block">
      <Slider
        {...settings}
        className="xl:w-[32rem] lg:w-[28rem] md:w-[26rem] sm:w-full"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-[#2a2a2a] relative text-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
          >
            <HeartIcon product={product} />
            <img
              loading="lazy"
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-bold truncate mb-2">{product.name}</h2>

            <p className="text-pink-400 font-semibold text-lg mb-2">
              ${product.price}
            </p>

            <p className="text-sm text-gray-300 mb-4">
              {product.description?.length > 120
                ? product.description.substring(0, 120) + "..."
                : product.description}
            </p>

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
