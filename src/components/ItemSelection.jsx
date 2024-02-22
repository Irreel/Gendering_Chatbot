import React from 'react';
import reactLogo from '../assets/react.svg';

function ItemSelection(props) {
    
    const onConfirm = props.onConfirm;
    // const onConfirm = () => {
    //     // Handle confirm logic here
    // };

    return (
        <div>
            <h1>Desert Survival Game</h1>
            <h3>Suppose you are in a desert survival game and need to choose the most essential items for survival from 5 pairs of options.</h3>
            <div className='CheckboxPairs'>
                <h3>Pair 1</h3>
                <div className='CheckboxPair' style={{display: 'flex', justifyContent: 'left'}}>
                    <input type='radio' name='pair1' value='option1' />
                    <label htmlFor='option1'>
                        <b>Canvas</b>
                        <img src={reactLogo} alt='React Logo' />
                        <p> A canvas could be spread out for shade, underneath which the temperature could be as much as 20 degrees cooler. It could also be spotted from the air by search parties.</p>
                    </label>

                    <input type='radio' name='pair1' value='option2' />
                    <label htmlFor='option2'>
                        <b>Tarp</b>
                        <img src={reactLogo} alt='Vite Logo' />
                        <p> The tarp could be used to purify water from a contaminated source by building a solar still. Because the tarp is bright blue it could also be used to signal search parties.</p>
                    </label>
                </div>
            </div>.
            {/* <div className='CheckboxPair' style={{display: 'flex', justifyContent: 'left'}}>
                    <input type='radio' name='pair2' value='option1' />
                    <label htmlFor='option1'>
                        <b>Canvas</b>
                        <img src={reactLogo} alt='React Logo' />
                        <p> A canvas could be spread out for shade, underneath which the temperature could be as much as 20 degrees cooler. It could also be spotted from the air by search parties.</p>
                    </label>

                    <input type='radio' name='pair2' value='option2' />
                    <label htmlFor='option2'>
                        <b>Tarp</b>
                        <img src={reactLogo} alt='Vite Logo' />
                        <p> The tarp could be used to purify water from a contaminated source by building a solar still. Because the tarp is bright blue it could also be used to signal search parties.</p>
                    </label>
            </div> */}
                {/* <div className='CheckboxPair'>
                    <input type='checkbox' name='pair2' value='option3' />
                    <label htmlFor='option3'>Option 3</label>
                    <input type='checkbox' name='pair2' value='option4' />
                    <label htmlFor='option4'>Option 4</label>
                </div>
                <div className='CheckboxPair'>
                    <input type='checkbox' name='pair3' value='option5' />
                    <label htmlFor='option5'>Option 5</label>
                    <input type='checkbox' name='pair3' value='option6' />
                    <label htmlFor='option6'>Option 6</label>
                </div>
                <div className='CheckboxPair'>
                    <input type='checkbox' name='pair4' value='option7' />
                    <label htmlFor='option7'>Option 7</label>
                    <input type='checkbox' name='pair4' value='option8' />
                    <label htmlFor='option8'>Option 8</label>
                </div>
                <div className='CheckboxPair'>
                    <input type='checkbox' name='pair5' value='option9' />
                    <label htmlFor='option9'>Option 9</label>
                    <input type='checkbox' name='pair5' value='option10' />
                    <label htmlFor='option10'>Option 10</label>
                </div> */}
            <button onClick={onConfirm}>Confirm</button>
        </div>
    );
}

export default ItemSelection;
