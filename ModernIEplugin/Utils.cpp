#include "stdafx.h"
#include "Utils.h"


CUtils::CUtils()
{
}


CUtils::~CUtils()
{
}

CString CUtils::GetScriptsPath()
{
	return GetPluginPath() + CAtlString("\\Scripts\\");
}

HINSTANCE CUtils::hInstance;

CAtlString CUtils::GetPluginPath()
{
	TCHAR szPath[MAX_PATH];
	GetModuleFileName(hInstance, szPath, MAX_PATH);
	CAtlString strAppPath(szPath);
	strAppPath = strAppPath.Left(strAppPath.ReverseFind('\\'));

	return strAppPath;
}

BSTR CUtils::ReadFileToBSTR(LPCWSTR lpFileName)
{
	LARGE_INTEGER file_size;
	DWORD bytes_read;

	HANDLE hFile = ::CreateFile(lpFileName,
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

//void CUtils::InjectCSS(IHTMLDocument2* pDocument)
//{
//	CComPtr<IHTMLElement> body;
//	pDocument->get_body(&body);
//
//	CComPtr<IHTMLScriptElement> scriptObject;
//	pDocument->createElement(L"script", (IHTMLElement**)&scriptObject);
//
//	scriptObject->put_type(L"text/javascript");
//	scriptObject->put_text(L"\nfunction hidediv(){document.getElementById('myOwnUniqueId12345').style.visibility = 'hidden';}\n\n");
//
//	CComPtr<IHTMLDOMNode> domnodebody;
//	body->QueryInterface(IID_IHTMLDOMNode, (void**)&domnodebody);
//
//	CComPtr<IHTMLDOMNode> domnodescript;
//	scriptObject->QueryInterface(IID_IHTMLDOMNode, (void**)&domnodescript);
//
//
//	CComPtr<IHTMLDOMNode> pRefNode = NULL;
//	domnodebody->appendChild(domnodescript, &pRefNode);
//}
