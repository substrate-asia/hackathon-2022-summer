import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, } from "antd";
import { FC } from "react";

interface DonationAmountStepperProps {
    amount: number,
    setAmount(val: number): void,
}

const DonationAmountStepper : FC<DonationAmountStepperProps> = ({amount, setAmount}) => {

    /**
     * @method
     * listen function to add click  
     * no validate here  
     * 
     * @return void
     */
    const handleAdd = () => {
        setAmount(amount+1);
    };
    
    /**
     * @method 
     * listener function to minus click  
     * stop update if the current amount <= 0
     * @returns void
     */
    const handleMinus = () => {
        if (amount <= 0) return;

        setAmount(amount-1);
    };


    return (
        <div style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>
            <Button 
                type='primary'
                shape='circle'
                disabled={amount<=0}
                icon={<MinusOutlined />}
                onClick={handleMinus}
            />
            <span 
                style={{
                    padding: '0px 10px', 
                    fontSize: 20, 
                    fontWeight: 600, 
                    marginBottom: 0,
                    minWidth: '2em',
                    textAlign: 'center'
                }}
            >
                {amount}
            </span>
            <Button 
                type='primary'
                shape='circle'            
                icon={<PlusOutlined />}
                onClick={handleAdd}
            />
            <span 
                style={{
                    fontSize: 18, 
                    fontWeight: 500, 
                    paddingLeft: 10
                }}
            >
                MATIC
            </span>
        </div>
    )
};

export default DonationAmountStepper;