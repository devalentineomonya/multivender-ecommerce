import React, { useEffect, useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onOtpSubmit?: (otp: string) => void;
  [key:string]:unknown
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onOtpSubmit = () => {}}) => {
  const [otpValue, setOtpValue] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const onOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtpValue = [...otpValue];
    newOtpValue[index] = value.substring(value.length - 1);
    setOtpValue(newOtpValue);
    const combinedOtp = newOtpValue.join("");
    if (combinedOtp.length === length) {
      onOtpSubmit(combinedOtp);
    }
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onOtpClick = (index: number) => {
    inputRefs.current[index].setSelectionRange(1, 1);
    if (index > 0 && !otpValue[index - 1]) {
      inputRefs.current[otpValue.indexOf("")]?.focus();
    }
  };

  const onOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    onOtpClick(index);
    switch (e.key) {
      case "Backspace":
        if (!otpValue[index] && index > 0 && inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "Delete":
        if (index < length - 1) {
          const newOtpValue = [...otpValue];
          if (newOtpValue[index + 1]) {
            newOtpValue[index + 1] = "";
            setOtpValue(newOtpValue);
            inputRefs.current[index + 1]?.focus();
          }
        }
        break;

      case "ArrowRight":
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "Enter":
        onOtpClick(index);
        break;

      default:
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, length);

    if (/^\d+$/.test(pasteData) && pasteData.length === length) {
      const newOtpValues = pasteData.split("").slice(0, length);
      setOtpValue(newOtpValues);

      onOtpSubmit(pasteData);
    } else if (/^\d+$/.test(pasteData)) {
      const newOtpValues = pasteData.split("").slice(0, length);
      const updatedOtpValues = [...otpValue];
      newOtpValues.forEach((value, index) => {
        updatedOtpValues[index] = value;
      });
      for (let i = newOtpValues.length; i < length; i++) {
        updatedOtpValues[i] = "";
      }
      setOtpValue(updatedOtpValues);

      const nextInputIndex = Math.min(newOtpValues.length, length - 1);
      inputRefs.current[nextInputIndex]?.focus();
    }

    e.preventDefault();
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  return (
    <div
      onPaste={handlePaste}
      className="flex flex-nowrap gap-x-2 justify-center items-center"
    >
      {otpValue.map((value, index) => (
        <input

          key={index}
          ref={(input) => {
            inputRefs.current[index] = input!;
          }}
          type="text"
          value={value}
          name={`otp-${index}`}
          id={`otp-input-${index}`}
          onChange={(e) => onOtpChange(e, index)}
          onClick={() => onOtpClick(index)}
          onKeyDown={(e) => onOtpKeyDown(e, index)}
          className="w-12 aspect-square border-2 border-gray-300 rounded-md outline-none text-center"
        />
      ))}
    </div>
  );
};

export default OtpInput;
