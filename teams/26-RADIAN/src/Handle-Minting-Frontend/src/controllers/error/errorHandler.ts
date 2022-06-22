export interface ErrorInterface {
    message: string,
    code: number,
}

const ErrorHandler = (code: number): ErrorInterface => {
    let message: string = ''

    switch(code) {

        /**
         * @error wallet connection issue
         */
        case 1000:
            message = 'Metamask not installed'
            break;

        case 3000:
            message = 'CDN fallback';
            break

        /**
         * @error FOR CREATE/UPDATE PROFILE
         */

        case 4010:
            message = 'Inappropriate Content Detected: Explicit Nudity, Violence, Visually Disturbing, Drugs, Hate Symbols';
            break


        /**
         * @error FOR UPDATE PROFILE
         */

        /**
         * @error FOR FETCHING PROFILE
         */
        case 4200:
            message = 'profile not found';
            break;


        /**
         * @error FOR BINDING NETWORK
         */
        case 4300:
            message = 'address already in use';
            break
        case 4390:
            message = 'external network not initialised';
            break
    }

    return {
        code, 
        message
    };
    
};

export default ErrorHandler;