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
	static void InjectScriptFromLocalFile(IHTMLDocument2* document, IHTMLDOMNode* parentNode, CAtlString filePath);
	static void InjectStyleFromLocalFile(IHTMLDocument2* document, IHTMLDOMNode* parentNode, CAtlString cssFilePath);

private:	
	static void InjectScript(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR text);
	static void InjectStyle(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR text);
	static CString GetPluginPath();
};

