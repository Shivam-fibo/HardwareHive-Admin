import { useInView } from "react-intersection-observer";

const CategoryCard = ({ category, image, modelNum, model, size, brand, onSelect, isSelected }) => {
  const { ref } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`bg-white rounded-lg shadow-md cursor-pointer p-2 w-48 h-48 transform transition-transform duration-300 hover:scale-105 
        border ${isSelected ? 'border-4 border-blue-500' : 'border-gray-300'}`}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        {image && (
          <div className="w-40 h-28 border rounded-md mt-1 p-1 shadow-sm flex items-center justify-center">
            <img
              src={image}
              alt={category}
              className="max-w-full max-h-full object-contain"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        )}

        <div className="mt-1 space-y-0.5 min-h-[60px] flex flex-col justify-center">
          <p className="text-[10px] text-gray-600 leading-tight">{category || "\u00A0"}</p>
          <p className="text-[10px] text-gray-600 leading-tight">{brand || "\u00A0"}</p>
          <p className="text-[10px] text-gray-600 leading-tight">{model}</p>
          <p className="text-[10px] text-gray-600 leading-tight">{size || "\u00A0"}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard