import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { IClaimContext } from "./type";
import qs from "query-string";

const DEFAULT_VALUE: IClaimContext = {
    handle: '',
    setHandle: (val: string) => { },
    step: 0,
    setStep: (val: number) => { },
    passColor: '#5829E3',
    setPassColor: (val: string) => { },
}

export const ClaimContext = createContext(DEFAULT_VALUE);

interface ClaimProviderProps {
    children: ReactNode
}

const ClaimProvider: FC<ClaimProviderProps> = (props) => {

    const [handle, setHandle] = useState<string>('');
    const [passColor, setPassColor] = useState<string>('#5829E3');
    const [step, setStep] = useState<number>(0);

    const history = useHistory();
    const location = useLocation();



    /**
     * function to convert step value to query params `alias` value  
     * @param val 
     * @returns 
     */
    const parseStepAlias = (val: number): (string | null) => {
        switch (val) {
            case 0:
                return 'choose-handle';
            case 1:
                return 'preview-handle';
            case 2:
                return 'complete';
            default:
                return null;
        }
    };

    /**
     * function to convert alias value in query params to step value  
     * @param val 
     * @returns 
     */
    const parseStepNumber = (val: string | null): number => {
        if (!val) return 0;

        switch (val) {
            case 'choose-handle':
                return 0;
            case 'preview-handle':
                return 1;
            case 'complete':
                return 2;
            default:
                return 0;
        }
    };

    /**
     * function to update the step value  
     * this function also inject query params to prevent page refresh  
     * @param val 
     */
    const updateStep = (val: number) => {
        const alias = parseStepAlias(val);
        if (alias) {
            const params = {
                alias: alias
            };
            const sq = new URLSearchParams(params).toString();
            history.push({
                pathname: history.location.pathname,
                search: `?${sq}`
            })
        }

        setStep(val);
    }

    useEffect(() => {
        if (location.search) {
            const params = qs.parse(location.search);
            const _step = parseStepNumber(params?.alias as string);
            setStep(_step);
        } else {
            updateStep(0);
        }
    }, [location])


    return (
        <ClaimContext.Provider value={{
            handle: handle,
            setHandle: setHandle,
            step: step,
            setStep: updateStep,
            passColor: passColor,
            setPassColor: setPassColor,
        }}>
            {props.children}
        </ClaimContext.Provider>
    )
};

export default ClaimProvider;