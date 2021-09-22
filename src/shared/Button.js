import './styles/Button.css';

const Button = ({children, ...restProps}) => {
    let classList = 'btn';
    if(restProps.large) {
        classList += ' btn-large';
    }

    if(restProps.className) {
        classList += '  '+restProps.className;
    }

    return (
        <button
            {...restProps}
            className={classList}>
            {children}
        </button>
    )
}

export default Button;
