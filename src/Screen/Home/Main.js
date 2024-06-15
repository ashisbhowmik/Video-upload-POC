import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Platform,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { signupRequest } from '../../Redux/Reducers/AuthReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import Loader from '../../Utils/Helpers/Loader';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Headerera from '../../Components/Header';
import SwipeButton from '../../Components/SwipeButton';
import Swipechange from '../../Components/Swipechange';
let status = '';
export default function NewsListScreen(props) {
    const [toggleState, setToggleState] = useState(false);
    const[push,setPush]= useState(0);
//   const handleToggle = (value) => setToggleState(value);
  const imagePaths = [
    Imagepath.God,
    Imagepath.Phnpe,
    Imagepath.Virat,
    Imagepath.Ind,
    Imagepath.Amzn,
    Imagepath.Apple,
    Imagepath.Flip,
    Imagepath.Howrh,
    Imagepath.HowrhE,
    Imagepath.Aadha,
    Imagepath.Gpay,
    Imagepath.Card,
    Imagepath.Patm,
    Imagepath.Fing
];
const imagePath = imagePaths[ push % imagePaths.length];

    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(-1);
    const [apiReq, setApiReq] = useState(false);
    useEffect(() => {
        if (!toggleState) {
            if (apiReq == false) {
                setPage(page + 1);
            }
        }
    }, [toggleState]);
console.log(toggleState,"fllll")
    function job_address() {
        let obj = {
            page: page,
            limit: 1
        };
        connectionrequest()
            .then(() => {
                dispatch(signupRequest(obj));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    }
    useEffect(() => {
        job_address();
    }, [toggleState]);
    useEffect(() => {
        const unsubscribe = props?.navigation.addListener('focus', () => {
            setData([]);
            setPage(1);
            job_address();
            setToggleState(false)
        });
        return unsubscribe;
    }, []);
 
  
    useEffect(() => {
        if (status === '' || AuthReducer.status !== status) {
            switch (AuthReducer.status) {
                case 'Auth/signupRequest':
                    status = AuthReducer.status;
                    console.log("hello")
                    setToggleState(false)
                    break;
                case 'Auth/signupSuccess':
                    status = AuthReducer.status;
                    setApiReq(false);
                    AuthReducer?.signupResponse?.length > 0
                        ? setData(AuthReducer?.signupResponse)
                        : setApiReq(true);
                    break;
                case 'Auth/signupFailure':
                    status = AuthReducer.status;
                    break;
                default:
                    break;
            }
        }
    }, [AuthReducer]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.black}
            />
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colorpath.white,
                }}>
                <Loader visible={AuthReducer?.status == 'Auth/signupRequest'} />
                <ImageBackground
                    style={
                        Platform.OS === 'ios'
                            ? {
                                //  flex: 1,
                                height: normalize(60),
                                backgroundColor: Colorpath.black,
                                //   backgroundColor:'red'
                            }
                            : {
                                //  flex: 1,
                                height: normalize(85),
                                backgroundColor: Colorpath.black,
                                paddingTop: normalize(5),
                            }
                    }
                    source={Imagepath.bgcAcc}>
                    <Headerera
                        onPress={() => props.navigation.navigate('OnboardingScreen')}
                        topImg={Imagepath.Back}
                        iheight={normalize(15)}
                        iwidth={normalize(15)}
                        tintColor={Colorpath.white}
                        onPressRight={() => { '' }}
                        middleText="News Feed"
                        color={Colorpath.white}
                        fontFamily={Fonts.PoppinsBold}
                        fontSize={normalize(15)}
                        marginLeft={normalize(90)}
                    />
                </ImageBackground>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: normalize(100) }}
                    showsVerticalScrollIndicator={false}
                    onScroll={() => {
                        
                    }}
                    scrollEventThrottle={16}>
                    <View>
                        {data?.length > 0 ? (
                            data?.map((item, index) => {
                                console.log(index)
                                return (
                                    <TouchableOpacity>
                                        <View
                                            style={{
                                                padding: normalize(10),
                                                // height: normalize(135),
                                                width: normalize(290),
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: Colorpath.white,
                                                // backgroundColor:'red',
                                                borderRadius: normalize(9),
                                                paddingHorizontal: normalize(13),
                                                //    paddingVertical:normalize(6),
                                                shadowOpacity: normalize(0.5),
                                                marginTop: normalize(10),
                                                shadowRadius: normalize(8),
                                                shadowOffset: { width: 0, height: 0 },
                                                shadowColor:
                                                    Platform.OS === 'ios'
                                                        ? Colorpath.shadow
                                                        : Colorpath.black,
                                                elevation: normalize(5),
                                                zIndex: index == show ? 999 : 0,
                                            }}>
                                            <View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        justifyContent: "center"
                                                    }}>
                                                    <View
                                                        style={{
                                                            alignItems: 'center',
                                                            justifyContent: "center"
                                                        }}>
                                                        <Image
                                                        source={imagePath} 
                                                        style={{ height: normalize(330), width: normalize(270), borderRadius: normalize(10) }}
                                                        resizeMode="cover"
                                                    />
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        fontSize: normalize(11.5),
                                                        fontFamily: Fonts.PoppinsSemiBold,
                                                        color: Colorpath.black,
                                                        paddingVertical: normalize(10),
                                                        textTransform: 'capitalize',
                                                    }}>
                                                        {item.title}
                                                    {/* {"Tirupati"} */}
                                                </Text>

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',


                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: normalize(11),
                                                                fontFamily: Fonts.PoppinsRegular,
                                                                color: Colorpath.black,
                                                                paddingLeft: normalize(0),
                                                            }}>
                                                                {item.body}
                                                            {/* {"Tirupati is a city in the Indian state of Andhra Pradesh. Its Sri Venkateswara Temple sits atop one of the the 7 peaks of Tirumala Hills, attracting scores of Hindu pilgrims. Sri Venkateswara National Park, home to the temple, also contains the Sri Venkateswara Zoological Park with lions and primates...."} */}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    
                                );
                            })
                        ) : (
                            <View>
                                <Text
                                    style={{
                                        fontSize: normalize(13),
                                        fontFamily: Fonts.PoppinsRegular,
                                        color: Colorpath.grey,
                                        paddingLeft: normalize(15),
                                        alignSelf: 'center'
                                    }}>
                                    No news Available
                                </Text>
                            </View>
                        )}
                    </View>
                    {data.length > 0 &&  !toggleState ?<View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <View style={styles.swipeButtonContainer}>
                        <TouchableOpacity style={{ marginTop: normalize(10) }}>
                            <SwipeButton onToggle={()=>{
                                setToggleState(!toggleState);
                                setPush(push + 1)
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>: data.length > 0 &&<View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <View style={styles.swipeButtonContainer}>
                        <TouchableOpacity style={{ marginTop: normalize(10) }}>
                            <Swipechange onToggle={()=>{setToggleState(!toggleState)}} />
                        </TouchableOpacity>
                    </View>
                </View> }
                   
                </ScrollView>

            </SafeAreaView>
        </>
    );
}
const styles = StyleSheet.create({
    swipeButtonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      shadowColor: '#000000',
      shadowOffset: { height: 3, width: 0 },
      shadowRadius: 10,
      shadowOpacity: 0.5,
      elevation: 1,
    }
  });
