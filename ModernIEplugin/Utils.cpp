#include "stdafx.h"
#include "Utils.h"


CUtils::CUtils()
{
}


CUtils::~CUtils()
{
}

HINSTANCE CUtils::hInstance;

CString CUtils::GetScriptsPath()
{
	return GetPluginPath() + CAtlString("\\Scripts\\");
}

CString CUtils::GetCSSsPath()
{
	return GetPluginPath() + CAtlString("\\CSS\\");
}

CAtlString CUtils::GetPluginPath()
{
	TCHAR szPath[MAX_PATH];
	GetModuleFileName(hInstance, szPath, MAX_PATH);
	CAtlString strAppPath(szPath);
	strAppPath = strAppPath.Left(strAppPath.ReverseFind('\\'));

	return strAppPath;
}

CComBSTR CUtils::ReadFileToBSTR(LPCWSTR fileName)
{
	LARGE_INTEGER file_size;
	DWORD bytes_read = 0;

	HANDLE hFile = ::CreateFile(fileName,
		GENERIC_READ,          
		FILE_SHARE_READ,       
		NULL,                  
		OPEN_EXISTING,         
		FILE_ATTRIBUTE_NORMAL,
		NULL);
	ATLASSERT(hFile != INVALID_HANDLE_VALUE);

	::GetFileSizeEx(hFile, &file_size);
	
	SIZE_T buffer_size = (SIZE_T)file_size.QuadPart;
	VOID* read_buffer = ::LocalAlloc(LMEM_ZEROINIT, buffer_size + 1);
	ATLASSERT(::ReadFile(hFile, read_buffer, buffer_size, &bytes_read, NULL));
	ATLASSERT(buffer_size == bytes_read);
	ATLASSERT(::CloseHandle(hFile));

	CComBSTR result = CComBSTR((LPCSTR)read_buffer);

	::LocalFree(read_buffer);

	return result;
}

void CUtils::InjectScriptFromLocalFile(IHTMLDocument2* document, IHTMLDOMNode* parentNode, CAtlString scriptFilePath)
{
	CComBSTR script_text = CUtils::ReadFileToBSTR(scriptFilePath);
	CUtils::InjectScript(document, parentNode, script_text);
}

void CUtils::InjectStyleFromLocalFile(IHTMLDocument2* document, IHTMLDOMNode* parentNode, CAtlString cssFilePath)
{
	CComBSTR style_text = CUtils::ReadFileToBSTR(cssFilePath);
	CUtils::InjectStyle(document, parentNode, style_text);
}

void CUtils::InjectScript(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR text)
{
	HRESULT hr;

	CComPtr<IHTMLElement> script_element_added;
	hr = document->createElement(CComBSTR("SCRIPT"), (IHTMLElement**)&script_element_added);
	ATLASSERT(hr == S_OK);

	CComPtr<IHTMLScriptElement> script_element;
	hr = script_element_added->QueryInterface(IID_IHTMLScriptElement, (void**)&script_element);
	ATLASSERT(hr == S_OK);

	script_element->put_type(CComBSTR("text/javascript"));
	script_element->put_text(text);

	CComPtr<IHTMLDOMNode> dom_node_script;
	hr = script_element->QueryInterface(IID_IHTMLDOMNode, (void**)&dom_node_script);
	ATLASSERT(hr == S_OK);

	CComPtr<IHTMLDOMNode> pRefNode = NULL;
	hr = parentNode->appendChild(dom_node_script, &pRefNode);
	ATLASSERT(hr == S_OK);
}

void CUtils::InjectStyle(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR text)
{
	HRESULT hr;

	CComPtr<IHTMLElement> style_element_added;
	hr = document->createElement(CComBSTR("STYLE"), (IHTMLElement**)&style_element_added);
	ATLASSERT(hr == S_OK);

	CComPtr<IHTMLStyleElement> style_element;
	hr = style_element_added->QueryInterface(IID_IHTMLStyleElement, (void**)&style_element);
	ATLASSERT(hr == S_OK);

	style_element->put_type(CComBSTR("text/css"));

	CComPtr<IHTMLStyleSheet> style_sheet;
	style_element->get_styleSheet((IHTMLStyleSheet**)&style_sheet);
	style_sheet->put_cssText(text);

	CComPtr<IHTMLDOMNode> dom_node_style;
	hr = style_element_added->QueryInterface(IID_IHTMLDOMNode, (void**)&dom_node_style);
	ATLASSERT(hr == S_OK); 

	CComPtr<IHTMLDOMNode> pRefNode = NULL;
	hr = parentNode->appendChild(dom_node_style, &pRefNode);
	ATLASSERT(hr == S_OK);
}