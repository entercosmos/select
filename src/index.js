import React from 'react'
import PropTypes from 'prop-types'
import arrowDown from '@pndr/icons/lib/arrowDown'
import { css, cx } from 'emotion'
import OptionList from './OptionList'

import defaultNoOptionsRenderer from './defaultNoOptionsRenderer'
import defaultOptionRenderer from './defaultOptionRenderer'
import defaultEmptyRenderer from './defaultEmptyRenderer';

export default class Select extends React.Component {

    static defaultProps = {
        clearable: false,
        alignRight: false,
        size: 'md'
    }

    static propTypes = {
        inline: PropTypes.bool,
        clearable: PropTypes.bool,
        disabled: PropTypes.bool,
        size: PropTypes.oneOf([
            'sm',
            'md'
        ]),
        alignLeft: PropTypes.bool,
        value: PropTypes.string,
        noOptionsRenderer: PropTypes.func,
        iconGetter: PropTypes.func,
        optionRenderer: PropTypes.func,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string
            })
        ),
        onChange: PropTypes.func
    }

    state = {
        open: false
    }

    render() {

        const { iconGetter, size } = this.props
        const optionRenderer = this.props.optionRenderer || defaultOptionRenderer
        const noOptionsRenderer = this.props.noOptionsRenderer || defaultNoOptionsRenderer

        const option = this.props.options.find(option => {
            return option.id === this.props.value
        })

        return (
            <div
                className={css`
                    position: relative;
                    width: 100%;
                `}
            >
                <div
                    className={cx(
                        css`
                        position: relative;
                        appearance: none;
                        background-color: #fff;
                        border: 1px solid #d9d9d9;
                        border-radius: 3px;
                        color: #191919;
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        height: ${size === 'sm' ? '30px' : '38px'};
                        line-height: 1.42857;
                        padding: 5px 15px;
                        transition: border-color .15s ease-in-out;
                        width: 100%;
                        cursor: pointer;
                    `,
                    !this.props.disabled ? css`
                    &:active {
                        -webkit-transition-duration: 0s;
                        border-color: #07f;
                        outline: 0;
                        transition-duration: 0s;
                    }
                    ` : css`
                        background-color: #f9f9f9;
                    `,
                        this.state.open ? css`
                            -webkit-transition-duration: 0s;
                            border-color: #07f;
                            outline: 0;
                            transition-duration: 0s;
                    ` : null
                    )}
                    onClick={this.handleToggle}
                >
                    <div
                        className={css`
                            display: flex;
                            flex: 1 1 auto;
                            min-width: 0;
                            min-height: 0;
                            align-items: center;
                        `}
                    >
                        <div
                            className={cx(css`
                                display: flex;
                                flex-grow: 1;
                                overflow: hidden;
                                white-space: nowrap;
                            `, this.props.alignRight ? css`justify-content: flex-end` : null
                            )}
                        >
                            {option ? optionRenderer({
                                option,
                                iconGetter
                            }) : defaultEmptyRenderer()}
                        </div>
                        <div>
                            {arrowDown({ width: 12 })}
                        </div>
                    </div>
                </div>
                {this.state.open ? (
                    <OptionList
                        inline={this.props.inline}
                        alignLeft={this.props.alignLeft}
                        value={this.props.value}
                        options={this.props.options}
                        clearable={this.props.clearable}
                        iconGetter={this.props.iconGetter}
                        onOptionClick={this.handleChange}
                        noOptionsRenderer={noOptionsRenderer}
                        optionRenderer={optionRenderer}
                        onClickOutside={this.close}
                    />
                ) : null}
            </div>

        )
    }

    handleToggle = () => {

        if (this.props.disabled) {
            return
        }

        this.setState({
            open: !this.state.open
        })
    }

    handleChange = ({ id }) => {

        this.setState({
            open: false
        })

        this.props.onChange({
            value: id
        })
    }

    close = () => {
        this.setState({
            open: false
        })
    }
}