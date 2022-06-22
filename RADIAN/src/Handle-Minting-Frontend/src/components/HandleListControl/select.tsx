import { Select } from "antd";
import { FC, useEffect, useState } from "react";

export interface HandleListPageSelectProps {
    page: number,
    setPage(value: number): void,
    count: number,
}

const HandleListPageSelect: FC<HandleListPageSelectProps> = ({
    page,
    setPage,
    count
}) => {

    const ITEM_PER_PAGE = 20;
    const [options, setOptions] = useState<number[]>([0]);

    const handleChange = (val: number) => {
        setPage(val as number);
    }

    useEffect(() => {
        if (count && count >= 0) {
            let _totalPage = Math.ceil(count / ITEM_PER_PAGE);
            setOptions(Array.apply(null, Array(_totalPage)).map((_, i) => i))
        }
    }, [count])

    return (
        <div>
            <Select
                dropdownClassName='HandleListControl-item'
                value={page}
                onChange={handleChange}
            >
                {options.map((o) => <Select.Option className='HandleListControl-item' value={o} >Page {o + 1}</Select.Option>)}
            </Select>
        </div>
    )
};

export default HandleListPageSelect;