interface DateRangePickerProps {
    range: string;
    from: string;
    to: string;
    onPreset: (range: string) => void;
    onFromChange: (v: string) => void;
    onToChange: (v: string) => void;
    onCustom: () => void;
    className?: string;
}
export declare function DateRangePicker({ range, from, to, onPreset, onFromChange, onToChange, onCustom, className, }: DateRangePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=date-range-picker.d.ts.map