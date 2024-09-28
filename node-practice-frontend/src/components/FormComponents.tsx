import React from "react";
import capitalize from "../utils/capitalize";

interface SelectMenuType {
    name: string;
    menuState: string;
    inputArray: string[];
    eventHandler: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface InputFieldType {
    label?: string;
    name: string;
    menuState: string | number;
    eventHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}

interface ColorPickerType {
    type: string;
    menuState: string | string[];
    colorsArray: string[];
    eventHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SelectMenu({ name, menuState, inputArray, eventHandler }: SelectMenuType) {

    return (
        <>
            {inputArray &&
                <select className={menuState ? 'bigButton selectedStyle' : 'bigButton idleStyle'} value={menuState} name={name} onChange={eventHandler}>
                    <option value="" disabled>
                        {capitalize(name)}
                    </option>
                    {inputArray.map((formality) => (
                        <option key={formality} value={formality}>
                        {capitalize(formality)}
                        </option>
                    ))}
                </select>
            }
        </>
    );

};

export function InputField({ label, name, menuState, eventHandler, type = "text", placeholder }: InputFieldType) {
    return (
        <div className={`${menuState ? "bigButton selectedStyle" : "bigButton idleStyle"} flexDirectionColumn`}>
            <label className="customLabel">{label}</label>
            <input className="textInputStyle" type={type} name={name} value={menuState} onChange={eventHandler} placeholder={placeholder} />
        </div>
    );
}

export function ColorPicker({ type, menuState, colorsArray, eventHandler }: ColorPickerType) {
    return (

        <div className={menuState.length !== 0 ? 'selectedStyle bigButton checkboxContainer' : 'bigButton idleStyle checkboxContainer'}>
            {colorsArray.map((color) => (
                <div key={color}>
                    <label className="formControl">
                        <input
                            type={type}
                            name="color"
                            value={color}
                            checked={menuState.includes(color)}
                            onChange={eventHandler}
                            style={{backgroundColor: color}}
                            className={color === "black" ? "whiteCheckmark" : "blackCheckmark"}
                        />
                    </label>
                </div>
            ))}
        </div>

    );
}