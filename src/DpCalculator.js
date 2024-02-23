import { useState } from 'react';
import './main.css';

const islands = {
	GG: {
		name: "Greengrass Isle", 
		dp: {4:  965232, 5: 2073695, 6:  4626380, 7:  8331417, 8: 19563553}
	},
	CB: {
		name: "Cyan Beach",
		dp: {4: 1574330, 5: 3511234, 6:  7162381, 7: 13488264, 8: 30491710},
	},
	TH: {
		name: "Taupe Hollow",
		dp: {4: 1829448, 5: 4626380, 6:  9935824, 7: 19563553, 8: 43706520}
	},
	SP: {
		name: "Snowdrop Tundra",
		dp: {4: 2825955, 5: 7164480, 6: 15469388, 7: 28772770, 8: 65701088}
	},
	LL: {
		name: "Lapis Lakeside",
		dp: {4: 3187180, 5: 7748373, 6: 16706828, 7: 30514962, 8: 68783664}
	},
}

const goodSleepDayEventMultiplier = [1, 1.5, 2, 2.5, 3, 4];

function SelectField({label, options, handleChange, value}){
	return (
		<div className="form-item">
			<label>{label}:</label>
			<select
				onChange={e => handleChange(e.target.value)}
				value={value}
			>
				{ options.map(option => <option key={option.value} value={option.value}>{option.name}</option>) }
			</select>
		</div>
	)
}

function NumberField({label, min, max, maxlength, handleChange, value}){
	return (
		<div className="form-item">
			<label>{label}:</label>
			<input
				type="number"
				min={min}
				max={max}
				onChange={e => handleChange(e.target.value)}
				onInput={e => {e.target.value = e.target.value.slice(0, maxlength)}}
				value={value}
			/>
		</div>
	)
}

function SleepDataForm({sleepData, handleChange}){
	return (
		<form className="form">
			<SelectField 
				label={"Island"}
				options={Object.entries(islands).map(([key, props]) => {return {value: key, name: props.name}})}
				handleChange={value => handleChange({island: value})}
				value={sleepData.island}
			/>
			<NumberField
				label={"Current Energy"}
				min={1}
				max={9999999}
				maxlength={7}
				handleChange={value => handleChange({currEnergy: value})}
				value={sleepData.currEnergy}
			/>
			<SelectField
				label={"Desired Pokemon Count"}
				options={[...Array(5).keys()].map(x => {return {value: x + 4, name: x + 4}})}
				handleChange={value => handleChange({pkmCount: value})}
				value={sleepData.pkmCount}
			/>
			<SelectField
				label={"Good Sleep Day Multiplier"}
				options={goodSleepDayEventMultiplier.map(x => {return {value: x, name: x}})}
				handleChange={value => handleChange({goodSleepDayEventMultiplier: value})}
				value={sleepData.goodSleepDayEventMultiplier}
			/>
		</form>
	)
}

function SleepDataResult({sleepData}){
	function getRequiredDp(){
		return islands[sleepData.island]["dp"][sleepData.pkmCount];
	}
	
	function getEnergy(){
		return Math.floor(sleepData.currEnergy * sleepData.goodSleepDayEventMultiplier);
	}
	
	function calRequiredScore() {
		return Math.round(getRequiredDp() / getEnergy());
	}
	
	function calSleepingTime(){
		return calRequiredScore() * 5.1;
	}
	
	function minute2Hour(min){
		return `${Math.floor(min / 60)}h${Math.floor(min % 60)}m${Math.round(min % 60 % 1 * 60)}s`; 
	}
	
	function calDp(){
		return getEnergy() * calRequiredScore();
	}
	
	return (
		<>
			<h1>Result</h1>
			<p>Required DP: {getRequiredDp()}</p>
			<p>Sleeping Score: {calRequiredScore()}</p>
			<p>Sleeping Time: {calSleepingTime().toFixed(1)} mins ({minute2Hour(calSleepingTime())})</p>
			<p>DP: {calDp()}</p>
		</>
	)
}

export default function DpCalculator() {
	const [sleepData, setSleepData] = useState({
		island: 'GG',
		currEnergy: 0,
		pkmCount: 4,
		goodSleepDayEventMultiplier: 1
	})
	
	function handleChange(prop){
		setSleepData(state => {
			return {...state, ...prop};
		});
	}
	
	return (
		<div className={"calculator"}>
			<h1>DP Calculator</h1>
			<SleepDataForm 
				sleepData={sleepData}
				handleChange={handleChange}
			/>
			{ sleepData.currEnergy && sleepData.currEnergy > 0 ? 
				<>
					<hr/>
					<SleepDataResult sleepData={sleepData}/>
				</>
				: null
			}
        </div>
    )
}
