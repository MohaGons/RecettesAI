export default function NutritionalInfoCard({ nutritionalInfo }) {
  // Convertir les infos nutritionnelles de JSON string si nécessaire
  const info =
    typeof nutritionalInfo === "string"
      ? JSON.parse(nutritionalInfo)
      : nutritionalInfo;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-amber-800 mb-4">
        Informations nutritionnelles
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-amber-700 font-medium">Calories</div>
          <div className="text-2xl font-bold text-amber-900">
            {info.calories || 0} kcal
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-amber-700 font-medium">Protéines</div>
          <div className="text-2xl font-bold text-amber-900">
            {info.proteins || 0}g
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-amber-700 font-medium">Glucides</div>
          <div className="text-2xl font-bold text-amber-900">
            {info.carbs || 0}g
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-amber-700 font-medium">Lipides</div>
          <div className="text-2xl font-bold text-amber-900">
            {info.fats || 0}g
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-amber-800 mb-2">Vitamines</h4>
          <div className="flex flex-wrap gap-2">
            {info.vitamins &&
              info.vitamins.map((vitamin, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {vitamin}
                </span>
              ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-amber-800 mb-2">Minéraux</h4>
          <div className="flex flex-wrap gap-2">
            {info.minerals &&
              info.minerals.map((mineral, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {mineral}
                </span>
              ))}
          </div>
        </div>

        {info.healthTips && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-1">Conseil santé</h4>
            <p className="text-sm text-gray-600">{info.healthTips}</p>
          </div>
        )}
      </div>
    </div>
  );
}
