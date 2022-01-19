import { create } from "react-test-renderer"
import ReactDOM from "react-dom"
import { Button } from "./Button"

describe ('Button Testing', () => {
    const onClickFunc = jest.fn()
    test('Button snapshot', () => {
        const button = create(
            <Button
                id={'buttonTest'}
                text={'buttonTest'}
                onClick={onClickFunc}
            />
        ).toJSON()
        expect(button).toMatchSnapshot()
    })

    function actionClick(callback: jest.Mock) {
		callback()
	}

    it('Display text correctly and click works', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <Button
                id={'buttonTest'}
                text={'Button Test'}
                onClick={onClickFunc}
            />,
            div
        )
        actionClick(onClickFunc)
        console.log(div.textContent)
        expect(div.textContent).toEqual('Button Test')
        expect(onClickFunc).toHaveBeenCalled()
        ReactDOM.unmountComponentAtNode(div)
    })
})