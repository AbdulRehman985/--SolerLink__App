import React from "react";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDeleted,
  isSerialTracked,
  setIsSerialTracked,
}) => {
  return (
    <div className="p-3">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Write Category Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="py-3 px-4 border rounded-lg w-full bg-gray-900 text-white"
        />
        {/* Serial Tracking Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="serialTracking"
            checked={isSerialTracked}
            onChange={(e) => setIsSerialTracked(e.target.checked)}
            className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
          />
          <label htmlFor="serialTracking" className="text-sm text-gray-300">
            Enable Serial Tracking (for panels)
          </label>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            {buttonText}
          </button>
          {handleDeleted && (
            <button
              type="button"
              onClick={handleDeleted}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
