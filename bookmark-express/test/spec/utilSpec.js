describe('UtilSpec', function () {

    it('should get correct key code', function () {
        var event, result;

        event = {keyCode: 1};
        result = bke.keys.getKeyCode(event);

        expect(result).toEqual(1);

        event = {which: 2};
        result = bke.keys.getKeyCode(event);

        expect(result).toEqual(2);
    });

    //Testing this SUCKS
    it('should escape regex', function () {
        var text, result, expected;

        text = 'h[t*t+p^s$://.{m}o(z)i[l]l\\a.org/en-US?US&JavaScript%2F';

        result = bke.util.escapeRegExp(text);

        //"Expected" here is every regex special character in the text variable above will be escaped
        //This is to prevent the characters from having regex meaning when they are passed for a regex match
        expected = 'h\\[t\\*t\\+p\\^s\\$://\\.\\{m\\}o\\(z\\)i\\[l\\]l\\\\a\\.org/en-US\\?US&JavaScript%2F';

        expect(result).toEqual(expected);
    });
});
