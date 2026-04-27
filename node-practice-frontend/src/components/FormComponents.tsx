import React from "react";
import capitalize from "../utils/capitalize";

interface SelectMenuType {
    name: string;
    menuState: string;
    inputArray: string[];
    eventHandler: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    mandatory?: number;
}

interface InputFieldType {
    label?: string;
    name: string;
    menuState: string | number;
    eventHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    mandatory?: number;
}

interface ColorPickerType {
    type: string;
    menuState: string | string[];
    colorsArray: string[];
    eventHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SelectMenu({ name, menuState, inputArray, eventHandler, mandatory }: SelectMenuType) {

    return (
        <>
            {inputArray &&
                <div className={`${menuState ? "bigButton selectedStyle" : "bigButton idleStyle"} flexDirectionColumn`}>
                    <label className="customLabel">{capitalize(name)} {mandatory === 1 && "*"}</label>
                    <select 
                        className="bigButton textInputStyle" 
                        value={menuState} 
                        name={name} 
                        onChange={eventHandler}>
                        <option value="" disabled selected></option>
                        {inputArray.map((category) => (
                            <option key={category} value={category}>
                                {capitalize(category)}
                            </option>
                        ))}
                    </select>
                </div>
            }
        </>
    );

};

export function InputField({ label, name, menuState, eventHandler, type = "text", placeholder, mandatory }: InputFieldType) {
    return (
        <div className={`${menuState ? "bigButton selectedStyle" : "bigButton idleStyle"} flexDirectionColumn`}>
            <label className="customLabel">{label} {mandatory === 1 && "*"}</label>
            <input className="textInputStyle" type={type} name={name} value={menuState} onChange={eventHandler} placeholder={placeholder} onKeyDown={(e) => type === "number" && e.key === "-" && e.preventDefault()}/>
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