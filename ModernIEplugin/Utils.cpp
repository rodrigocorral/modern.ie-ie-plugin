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

BSTR CUtils::ReadFileToBSTR(LPCWSTR fileName)
{
	LARGE_INTEGER file_size;
	DWORD bytes_read;

	HANDLE hFile = ::CreateFile(fileName,
		GENERIC_READ,          
		FILE_SHARE_READ,       
		NULL,                  
		OPEN_EXISTING,         
		FILE_ATTRIBUTE_NORMAL,
		NULL);
	ATLENSURE(hFile != INVALID_HANDLE_VALUE);

	ATLENSURE(::GetFileSizeEx(hFile, &file_size));
	
	SIZE_T buffer_size = (SIZE_T)file_size.QuadPart;
	VOID* read_buffer = ::LocalAlloc(LMEM_ZEROINIT, buffer_size);
	ATLENSURE(::ReadFile(hFile, read_buffer, buffer_size, &bytes_read, NULL));
	ATLENSURE(::CloseHandle(hFile));

	CComBSTR result = CComBSTR((LPCSTR)read_buffer);

	return result;
}

void CUtils::InjectScript(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR src)
{
	HRESULT hr;

	CComPtr<IHTMLElement> script_element_added;
	hr = document->createElement(CComBSTR(_T("SCRIPT")), (IHTMLElement**)&script_element_added);
	ATLENSURE(hr == S_OK);

	CComPtr<IHTMLScriptElement> script_element;
	hr = script_element_added->QueryInterface(IID_IHTMLScriptElement, (void**)&script_element);
	ATLENSURE(hr == S_OK);

	hr = script_element->put_type(CComBSTR(_T("text/javascript")));
	ATLENSURE(hr == S_OK);

	hr = script_element->put_src(src);
	ATLENSURE(hr == S_OK);

	CComPtr<IHTMLDOMNode> dom_node_script;
	hr = script_element->QueryInterface(IID_IHTMLDOMNode, (void**)&dom_node_script);
	ATLENSURE(hr == S_OK);

	CComPtr<IHTMLDOMNode> pRefNode = NULL;
	hr = parentNode->appendChild(dom_node_script, &pRefNode);
	ATLENSURE(hr == S_OK);
}

void CUtils::InjectLink(IHTMLDocument2* document, IHTMLDOMNode* parentNode, BSTR rel, BSTR type, BSTR href)
{
	HRESULT hr;

	CComPtr<IHTMLElement> link_element_added;
	hr = document->createElement(CComBSTR(_T("LINK")), (IHTMLElement**)&link_element_added);
	ATLENSURE(hr == S_OK);

	CComPtr<IHTMLLinkElement> link_element;
	hr = link_element_added->QueryInterface(IID_IHTMLLinkElement, (void**)&link_element);
	ATLENSURE(hr == S_OK);

	hr = link_element->put_rel(rel);
	ATLENSURE(hr == S_OK);

	hr = link_element->put_type(type);
	ATLENSURE(hr == S_OK);

	hr = link_element->put_href(href);
	ATLENSURE(hr == S_OK);

	CComPtr<IHTMLDOMNode> dom_node_link;
	hr = link_element->QueryInterface(IID_IHTMLDOMNode, (void**)&dom_node_link);
	ATLENSURE(hr == S_OK);

	CComPtr<IHTMLDOMNode> pRefNode = NULL;
	hr = parentNode->appendChild(dom_node_link, &pRefNode);
	ATLENSURE(hr == S_OK);
}