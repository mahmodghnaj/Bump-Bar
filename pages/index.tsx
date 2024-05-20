import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface KeyPressInfo {
  code: number;
  nameKey: string;
  btn: string;
}

const Page: React.FC = () => {
  const btn = ["BUMP", "RECALL", "SUM", "PAGE", "Up", "Down"];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [keyPressInfos, setKeyPressInfos] = useState<{
    [key: string]: KeyPressInfo;
  }>({});

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleKeyPress = (
    key: string,
    label: string,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Backspace") {
      setInputValues((prevValues) => ({
        ...prevValues,
        [key]: "DONE",
      }));
      setKeyPressInfos((prevInfos) => ({
        ...prevInfos,
        [key]: {
          code: event.keyCode,
          nameKey: event.key,
          btn: label,
        },
      }));
      focusNextInput(key);
    } else {
      setInputValues((prevValues) => ({
        ...prevValues,
        [key]: "",
      }));
      setKeyPressInfos((prevInfos) => {
        const newInfos = { ...prevInfos };
        delete newInfos[key];
        return newInfos;
      });
    }
  };

  const focusNextInput = (currentKey: string) => {
    const allKeys = [
      ...btn.map((_, i) => `btn-${i}`),
      ...numbers.map((n) => `num-${n}`),
    ];
    const currentIndex = allKeys.indexOf(currentKey);
    const nextKey = allKeys[currentIndex + 1];
    if (nextKey && inputRefs.current[nextKey]) {
      //@ts-ignore
      inputRefs.current[nextKey].focus();
    }
  };

  const formatKeyPressInfos = (infos: {
    [key: string]: KeyPressInfo;
  }): string => {
    return Object.entries(infos)
      .map(
        ([key, info]) =>
          `name btn: ${info.btn} - key Code: ${info.code} - name key: ${info.nameKey}`
      )
      .join("\n\n");
  };

  const exportToFile = (type: "pdf") => {
    const formattedText = formatKeyPressInfos(keyPressInfos);

    if (type === "pdf") {
      const doc = new jsPDF();
      const lines = formattedText.split("\n");
      doc.text(lines, 10, 10);
      doc.save("keyPressInfos.pdf");
    }
  };

  const areAllInputsFilled = () => {
    const totalInputs = btn.length + numbers.length;
    return (
      Object.keys(inputValues).length === totalInputs &&
      Object.values(inputValues).every((value) => value === "DONE")
    );
  };
  useEffect(() => {
    const firstKey = `btn-0`;
    if (inputRefs.current[firstKey]) {
      inputRefs.current[firstKey].focus();
    }
  }, []);
  return (
    <div className="w-full h-full flex flex-col pt-20 items-center bg-gray-200">
      <h1 className="text-7xl font-bold">Bump Bar</h1>
      <div className="flex space-x-6 mt-8">
        {btn.map((item, index) => {
          const key = `btn-${index}`;
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center"
            >
              <div className="font-extrabold text-2xl">{item}</div>
              <div className="mt-4">
                <input
                  //@ts-ignore
                  ref={(el) => (inputRefs.current[key] = el)}
                  required
                  type="text"
                  className="size-[100px] rounded-xl border-md border-blue-300 border-4 text-3xl text-green-500 text-center outline-none focus:shadow-2xl shadow-sky-950 focus:border-blue-950"
                  value={inputValues[key] || ""}
                  onKeyDown={(e) => handleKeyPress(key, item, e)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6 mt-8">
        {numbers.map((item) => {
          const key = `num-${item}`;
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center"
            >
              <div className="font-extrabold text-2xl">{item}</div>
              <div className="mt-4">
                <input
                  //@ts-ignore
                  ref={(el) => (inputRefs.current[key] = el)}
                  type="text"
                  required
                  className="size-[100px] rounded-xl border-md border-blue-300 border-4 text-3xl text-green-500 text-center outline-none focus:border-blue-950"
                  value={inputValues[key] || ""}
                  onKeyDown={(e) => handleKeyPress(key, `Number ${item}`, e)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        <button
          onClick={() => exportToFile("pdf")}
          className={`px-4 py-2 ${
            areAllInputsFilled() ? "bg-red-500" : "bg-gray-500"
          } text-white rounded`}
          disabled={!areAllInputsFilled()}
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default Page;
