import React from 'react';
import Select, {OptionsType, ValueType, ActionMeta, components, IndicatorProps} from 'react-select';
import {WithClassName} from 'utils/WithClassName';
import {Icon} from 'components/icon';
import arrow from './images/arrow.svg';
import './dropdown.component.sass';

type Props = {
  options: DDItems;
  defaultValue: DDItem;
  onChange: onDDChange;
  noOptionsMessage(): string;
} & WithClassName;

export const Dropdown: React.FC<Props> = props =>
  <Select
    classNamePrefix="dropdown"
    components={{DropdownIndicator}}
    {...props}
  />;

const DropdownIndicator = (props: IndicatorProps<DDItem>) => (
  <components.DropdownIndicator {...props}>
    <Icon src={arrow}/>
  </components.DropdownIndicator>
);

export type DDItems = OptionsType<DDItem>;
export type DDItem = {
  value: string;
  label: string;
};
export type onDDChange = (value: ValueType<DDItem>, meta: ActionMeta) => void;
