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
	static BSTR ReadFileToBSTR(LPCWSTR fileName);
	static void InjectScript(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR src);
	static void InjectLink(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR rel, BSTR type, BSTR href);

private:
	static CString GetPluginPath();
};

