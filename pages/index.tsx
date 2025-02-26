import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const labels = ["BUMP", "RECALL", "SUM", "PAGE"];

const Page: React.FC = () => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [keyPressInfos, setKeyPressInfos] = useState<{ [key: string]: string }>(
    {}
  );
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: string }>({});
  const [isRecording, setIsRecording] = useState(false);

  const handleKeyDown = (
    key: string,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.repeat || event.code === "Escape" || event.code === "Tab") {
      event.preventDefault();
      return;
    }
    setIsRecording(true);
    setPressedKeys((prev) => ({
      ...prev,
      [key]: (prev[key] ? prev[key] + " + " : "") + event.code,
    }));
  };

  const handleKeyUp = (key: string) => {
    if (!isRecording) return;
    setInputValues((prev) => ({ ...prev, [key]: "DONE" }));
    setKeyPressInfos((prev) => ({ ...prev, [key]: pressedKeys[key] || "" }));
    setIsRecording(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    labels.forEach((label, index) => {
      doc.text(
        `${label}: ${keyPressInfos[label] || "No Input"}`,
        10,
        10 + index * 10
      );
    });
    doc.save("keyPressInfos.pdf");
  };

  return (
    <div className="w-full h-full flex flex-col pt-20 items-center bg-gray-200">
      <h1 className="text-7xl font-bold">Bump Bar</h1>
      <div className="flex space-x-6 mt-8">
        {labels.map((label, index) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center"
          >
            <div className="font-extrabold text-2xl">{label}</div>
            <div className="mt-4">
              <input
                // @ts-ignore
                ref={(el) => (inputRefs.current[label] = el)}
                type="text"
                className="size-[100px] rounded-xl border-4 border-blue-300 text-3xl text-green-500 text-center outline-none focus:border-blue-950"
                value={inputValues[label] || ""}
                onKeyDown={(e) => handleKeyDown(label, e)}
                onKeyUp={() => handleKeyUp(label)}
                onKeyPress={(e) => e.code === "Tab" && e.preventDefault()}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-red-500 text-white rounded"
          disabled={Object.keys(inputValues).length < labels.length}
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default Page;
