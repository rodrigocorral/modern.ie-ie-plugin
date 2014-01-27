#pragma once

#include <atlstr.h>
using namespace ATL;

class CUtils
{
public:
	CUtils();
	virtual ~CUtils();

	static HINSTANCE hInstance;
	static CString GetScriptsPath();
	static CString GetCSSsPath();
	static CComBSTR ReadFileToBSTR(LPCWSTR fileName);
	static void InjectScript(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR text);
	static void InjectStyle(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR text);

private:
	static CString GetPluginPath();
};

